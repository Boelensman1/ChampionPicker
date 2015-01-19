<?php

define('BASEPATH', dirname(realpath(dirname(__FILE__))).'/');
define('ICONS', 'img/icons/');
define('SPLASHES', 'img/splashes/');
define('DATA', BASEPATH . 'data/');

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
    define('DDRAGONVERSION', '5.1.1');
}

if (!defined('VERBOSE')) {
    define('VERBOSE', 0);
}
if (!defined('FORCE')) {
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
    public $champions = array();
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
        $this->lists->freeToPlay = array();
        $this->lists->rankedEnabled = array();

        echo_console('Loading champion info');
        foreach ($championsRaw as $i => $championRaw) {
            if (VERBOSE<1)
            {
            progressBar($i, count($championsRaw));
            }
            $this->champions[$i] = new Champion($this->_apiKey,$this->_ddDragonVersion, $championRaw);
            echo_console($championRaw->id . ' info', 1);
            $this->champions[$i]->loadFromAPIbyID();
            echo_console($this->champions[$i]->name . ' images', 1);
            $this->champions[$i]->getImages(FORCE);

            if ($this->champions[$i]->active == true) {
                $this->lists->active[] = $i;
            }
            if ($this->champions[$i]->freeToPlay == true) {
                $this->lists->freeToPlay[] = $i;
            }
            if ($this->champions[$i]->rankedEnabled == true) {
                $this->lists->rankedEnabled[] = $i;
            }
            progressBar($i+1, count($championsRaw));
        }
    }

    public function saveChampions()
    {
        echo_console('saving champion info');
        $json = json_encode($this->lists->active);
        file_put_contents(DATA . 'active.json', $json);
        $json = json_encode($this->lists->freeToPlay);
        file_put_contents(DATA . 'freeToPlay.json', $json);
        $json = json_encode($this->lists->rankedEnabled);
        file_put_contents(DATA . 'rankedEnabled.json', $json);
        //make a copy of champions
        $championsTemp=$this->champions;
        foreach ($championsTemp as $i=>$champion)
        {
            progressBar($i+1, count($championsTemp));
            unset($champion->active,$champion->freeToPlay,$champion->rankedEnabled);
        }
        $json = json_encode($this->champions);
        file_put_contents(DATA . 'champions.json', $json);
    }
}

class Champion
{
    private $_apiKey;
    private $_id;
    public $active;
    public $freeToPlay;
    public $rankedEnabled;
    public $iconURL;
    public $splashURL;
    public $iconSRC;
    public $splashSRC;
    private $_baseUrlIcon;
    private $_baseUrlSplash = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/';

    public function __construct($_apiKey, $ddDragonVersion,$championRaw, $force = false)
    {
        $this->_apiKey = $_apiKey;
        $this->_baseUrlIcon='http://ddragon.leagueoflegends.com/cdn/'.$ddDragonVersion.'/img/champion/';
        $this->_id = $championRaw->id;
        $this->active = $championRaw->active;
        $this->freeToPlay = $championRaw->freeToPlay;
        $this->rankedEnabled = $championRaw->rankedPlayEnabled;
    }

    public function loadFromAPIbyID($id = null)
    {
        if ($id != null) {
            $this->$_id = $id;
        }
        $url = 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/' . $this->_id . '?champData=image&api_key=' . $this->_apiKey;
        $champion_json = download($url);
        $championRaw = json_decode($champion_json);
        if (!$championRaw) {
            echo_console($champion_json, 3);
            die('Error while trying to get champions.');
        }
        unset($champion_json);
        $this->name = $championRaw->name;
        $this->iconURL = $this->_baseUrlIcon . $championRaw->image->full;

        $this->splashURL = $this->_baseUrlSplash . substr($championRaw->image->full, 0, -4) . '_0.jpg';

        $this->iconSRC = ICONS . $this->name . '.png';
        $this->splashSRC = SPLASHES . $this->name . '.png';
    }

    public function getImages($force = false)
    {
        //download the images
        echo_console($this->name . ' icon', 2);
        if (!file_exists($this->iconSRC) || $force == true) {
            download($this->iconURL, BASEPATH.$this->iconSRC);
        }

        echo_console($this->name . ' splash', 2);
        if (!file_exists($this->splashSRC) || $force == true) {
            download($this->splashURL, BASEPATH.$this->splashSRC);
        }
    }
}

function download($url, $filename = null)
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
    return file_put_contents($filename, $return);
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
    $perc = round(($done / $total) * 100);
    $bar  = "[" . str_repeat("=", $perc);
    $bar  = substr($bar, 0, strlen($bar) - 1) . ">"; // Change the last = to > for aesthetics
    $bar .= str_repeat(" ", 100 - $perc) . "] - $perc% - $done/$total";
    echo "$bar\r"; // Note the \r. Put the cursor at the beginning of the line
    }
}