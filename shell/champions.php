<?php

define('BASEPATH', dirname(realpath(dirname(__FILE__))).'/');
define('ICONS', 'img/icons/');
define('SPLASHES', 'img/splashes/');
define('DATA', BASEPATH . 'data/');

$order=file_get_contents(DATA.'order.json');
$order=json_decode($order);


//get the extra arguments
$extraArguments = $argv;
unset($extraArguments[0]);
foreach ($extraArguments as $extraArgument) {
    if (!preg_match('/^--(\w+)=?(.*)?$/', $extraArgument, $argumentParsed)) {
        echo_console('unknown argument "' . $extraArgument . '"');
        show_help();
    }
    switch ($argumentParsed[1]) {
        case 'force': {
            define('FORCE', true);
            break;
        }
        case 'verbose': {
            define('VERBOSE',(int) $argumentParsed[2]);
            break;
        }
        case 'apikey':{
            define('APIKEY',$argumentParsed[2]);
            break;
        }
        case 'dragonversion':
        {
            define('DDRAGONVERSION',$argumentParsed[2]);
            break;
        }
        default: {
            echo_console('unknown argument "' . $extraArgument . '"');
            show_help();
            break;
        }
    }
}
unset($argumentParsed);
unset($extraArguments);

if (!defined('APIKEY')) {
    die('No apikey given!');
}
if (!defined('DDRAGONVERSION')) {
    echo_console('WARNING: no ddragonversion given, using default 5.1.1');
    /** @noinspection PhpConstantReassignmentInspection */
    define('DDRAGONVERSION', '5.1.1');
}

if (!defined('VERBOSE')) {
    /** @noinspection PhpConstantReassignmentInspection */
    define('VERBOSE', 0);
}
if (!defined('FORCE')) {
    /** @noinspection PhpConstantReassignmentInspection */
    define('FORCE', false);
}

//the actual work
$api = new ChampionsAPI(APIKEY,DDRAGONVERSION);
$api->getChampions();
$api->saveChampions();

//Classes
class ChampionsList
{
    public $champions;

    public function __construct($jsonIn)
    {
        $this->champions = json_decode($jsonIn);
    }

}


class ChampionsAPI
{
    private $_apiKey;
    private $_ddDragonVersion;
    /** @var Champion[] */
    public $champions = array();
    public $championsArray = array();
    public $lists;

    public function __construct($_apiKey,$_ddDragonVersion)
    {
        $this->_apiKey = $_apiKey;
        $this->_ddDragonVersion = $_ddDragonVersion;
    }

    public function getChampions()
    {
        echo_console('Getting champions from riot API');
        $url = 'https://euw.api.pvp.net/api/lol/euw/v1.2/champion?api_key=' . $this->_apiKey;
        $champions_json = download($url);
        $championsRaw = json_decode($champions_json);
        if (!$championsRaw) {
            echo_console($champions_json, 3);
            die('Error while trying to get champions.');
        }
        unset($champions_json);
        $championsRaw = $championsRaw->champions;

        $this->champions = array();
        $this->lists = new stdClass();
        $this->lists->active = array();
        $this->lists->rankedEnabled = array();

        echo_console('Loading champion info');
        foreach ($championsRaw as $i => $championRaw) {
            if (VERBOSE<1)
            {
            progressBar($i, count($championsRaw));
            }
            $id=$championRaw->id;
            $this->championsArray[$i]=$id;

            $this->champions[$id] = new Champion($this->_apiKey,$this->_ddDragonVersion, $championRaw);
            echo_console($championRaw->id . ' info', 1);
            $this->champions[$id]->loadFromAPIbyID();
            echo_console($this->champions[$id]->name . ' images', 1);
            $this->champions[$id]->getImages(FORCE);

            if ($this->champions[$id]->active == true) {
                $this->lists->active[] = $id;
            }
            if ($this->champions[$id]->rankedEnabled == true) {
                $this->lists->rankedEnabled[] = $id;
            }
            progressBar($i+1, count($championsRaw));
        }
    }

    public function saveChampions()
    {
        echo_console('saving champion info');
        $json = json_encode($this->lists->active);
        file_put_contents(DATA . 'active.json', $json);
        $json = json_encode($this->lists->rankedEnabled);
        file_put_contents(DATA . 'rankedEnabled.json', $json);
        //make a copy of champions
        $championsTemp=$this->champions;
        $i=0;
        foreach ($championsTemp as $champion)
        {
            $i++;
            progressBar($i, count($this->championsArray));
            unset($champion->active,$champion->rankedEnabled);
        }
        $json = utf8_encode (json_encode($this->champions));
        file_put_contents(DATA . 'champions.json', $json);

        $json = json_encode($this->championsArray);
        file_put_contents(DATA . 'order.json', $json);
    }
}

class Champion
{
    private $_apiKey;
    private $_id;
    public $name;
    public $active;
    public $rankedEnabled;
    public $iconURL;
    public $splashURL;
    public $iconSRC;
    public $splashSRC;
    public $title;
    public $description;
    private $_baseUrlIcon;
    private $_baseUrlSplash = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/';

    public function __construct($_apiKey, $ddDragonVersion,$championRaw, $force = false)
    {
        $this->_apiKey = $_apiKey;
        $this->_baseUrlIcon='http://ddragon.leagueoflegends.com/cdn/'.$ddDragonVersion.'/img/champion/';
        $this->_id = $championRaw->id;
        $this->active = $championRaw->active;
        $this->rankedEnabled = $championRaw->rankedPlayEnabled;
    }

    public function loadFromAPIbyID($id = null)
    {
        if ($id != null) {
            $this->$_id = $id;
        }
        $url = 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/' . $this->_id . '?champData=image,lore&api_key=' . $this->_apiKey;
        $champion_json = download($url);
        $championRaw = json_decode($champion_json);
        if (!$championRaw) {
            echo_console($champion_json, 3);
            die('Error while trying to get champions.');
        }
        unset($champion_json);
        $this->name = $championRaw->name;
        $this->title=$championRaw->title;
        $this->description=$championRaw->lore;

        $this->iconURL = $this->_baseUrlIcon . $championRaw->image->full;
        $this->splashURL = $this->_baseUrlSplash . substr($championRaw->image->full, 0, -4) . '_0.jpg';

        $nameSanitized=preg_replace('/\\W/','',$this->name);
        $this->iconSRC = ICONS . $nameSanitized . '.jpg';
        $this->splashSRC = SPLASHES . $nameSanitized . '.jpg';
    }

    public function getImages($force = false)
    {
        //download the images
        echo_console($this->name . ' icon', 2);
        if (!file_exists(BASEPATH.$this->iconSRC) || $force == true) {
            download($this->iconURL, BASEPATH.$this->iconSRC,70);
        }

        echo_console($this->name . ' splash', 2);
        if (!file_exists(BASEPATH.$this->splashSRC) || $force == true) {
            download($this->splashURL, BASEPATH.$this->splashSRC,70);
        }
    }
}

function download($url, $filename = null,$quality=null)
{
    $return = @file_get_contents($url);
    //error
    if ($return === FALSE) {
        //try again.
        $return = file_get_contents($url);
    }
    if ($filename === null) {
        return $return;
    }
    //still error
    if ($return === FALSE) {
        die('Error while saving.');
    }
    if ($quality===null)
    {
    return file_put_contents($filename, $return);
    }
    else{
        //its an image, lets first reduce the filesize
        $return=imagecreatefromstring($return);
        imagejpeg($return, $filename, $quality);
    }
}

function echo_console($input, $verbose = 0)
{
    if ($verbose <= VERBOSE) {
        echo $input . "\n";
    }
}

function show_help()
{//TODO: MAKE HELP FUNCTION
    echo_console('HELP FUNCTION');
    die;
}


function progressBar($done, $total){
    if (VERBOSE<=0)
    {
        $percent = round(($done / $total) * 100);
    $bar  = "[" . str_repeat("=", $percent);
    $bar  = substr($bar, 0, strlen($bar) - 1) . ">"; // Change the last = to > for aesthetics
    $bar .= str_repeat(" ", 100 - $percent) . "] - $percent% - $done/$total";
    echo "$bar\r"; // Note the \r. Put the cursor at the beginning of the line
    }
}