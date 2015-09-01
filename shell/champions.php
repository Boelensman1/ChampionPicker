<?php

define('BASEPATH', dirname(realpath(dirname(__FILE__))) . '/');
define('ICONS', 'img/icons/');
define('SPLASHES', 'img/splashes/');
define('DATA', BASEPATH . 'data/');

//url's
define('BASE_URL_MOBAFIRESEARCH', 'http://www.mobafire.com/ajax/searchSite?text=');
define('END_URL_MOBAFIRESEARCH', '&search=champions');
define('BASE_URL_MOBAFIRERESULT', 'http://www.mobafire.com');
define('BASE_URL_PROBUILDS', 'http://www.probuilds.net/champions/');
define('BASE_URL_CHAMPIONGG', 'http://champion.gg/champion/');
define('BASE_URL_LOLWIKI', 'http://leagueoflegends.wikia.com/wiki/');

$order = file_get_contents(DATA . 'order.json');
$order = json_decode($order);


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
            define('VERBOSE', (int)$argumentParsed[2]);
            break;
        }
        case 'apikey': {
            define('APIKEY', $argumentParsed[2]);
            break;
        }
        case 'dragonversion': {
            define('DDRAGONVERSION', $argumentParsed[2]);
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
$api = new ChampionsAPI(APIKEY, DDRAGONVERSION);
$api->getChampions();
$api->saveChampions();
$api->saveRoles();

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
    /** @var Champion[] */
    public $champions = array();
    public $championsArray = array();
    public $lists;
    private $_apiKey;
    private $_ddDragonVersion;

    public function __construct($_apiKey, $_ddDragonVersion)
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
            if (VERBOSE < 1) {
                progressBar($i, count($championsRaw));
            }
            $id = $championRaw->id;
            $this->championsArray[$i] = $id;

            $this->champions[$id] = new Champion($this->_apiKey, $this->_ddDragonVersion, $championRaw);
            echo_console($championRaw->id . ' info', 1);
            $this->champions[$id]->loadFromAPIbyID();

            echo_console($this->champions[$id]->name . ' links', 1);
            $this->champions[$id]->getLinks();

            echo_console($this->champions[$id]->name . ' images', 1);
            $this->champions[$id]->getImages(FORCE);

            echo_console($this->champions[$id]->name . ' role', 1);
            $this->champions[$id]->getRole(FORCE);

            if ($this->champions[$id]->active == true) {
                $this->lists->active[] = $id;
            }
            if ($this->champions[$id]->rankedEnabled == true) {
                $this->lists->rankedEnabled[] = $id;
            }
            progressBar($i + 1, count($championsRaw));
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
        $championsTemp = $this->champions;
        $i = 0;
        foreach ($championsTemp as $champion) {
            $i++;
            progressBar($i, count($this->championsArray));
            unset($champion->active, $champion->rankedEnabled);
        }
        $json = utf8_encode(json_encode($this->champions));
        file_put_contents(DATA . 'champions.json', $json);

        $json = json_encode($this->championsArray);
        file_put_contents(DATA . 'order.json', $json);
    }

    public function saveRoles()
    {
        echo_console('saving role info');

        //the role array
        $roles = [[], [], [], [], []];//[ [top], [jungle], [mid], [adc], [support] ]

        $i = 0;
        foreach ($this->champions as $id => $champion) {
            $i++;
            progressBar($i, count($this->championsArray));
            foreach ($champion->roles as $role) {
                $roles[$role][] = $id;
            }
        }

        //write the json
        $json = json_encode($roles);
        file_put_contents(DATA . 'roles.json', $json);
    }
}

class Champion
{
    public $name;
    public $nameLower;
    public $nameShort;
    public $active;
    public $rankedEnabled;
    public $iconURL;
    public $splashURL;
    public $iconSRC;
    public $splashSRC;
    public $title;
    public $description;
    public $roles;
    public $mobafireURL;
    public $probuildsURL;
    public $championggURL;
    public $lolwikiURL;
    private $_apiKey;
    private $_id;
    private $_baseUrlIcon;
    private $_baseUrlSplash = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/';

    public function __construct($_apiKey, $ddDragonVersion, $championRaw, $force = false)
    {
        $this->_apiKey = $_apiKey;
        $this->_baseUrlIcon = 'http://ddragon.leagueoflegends.com/cdn/' . $ddDragonVersion . '/img/champion/';
        $this->_id = $championRaw->id;
        $this->active = $championRaw->active;
        $this->rankedEnabled = $championRaw->rankedPlayEnabled;
    }

    public function loadFromAPIbyID($id = null)
    {
        if ($id != null) {
            $this->_id = $id;
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
        $this->nameLower = strtolower($championRaw->name);
        $this->nameShort = preg_replace("/\\W/", '', $championRaw->name);
        $this->title = $championRaw->title;
        $this->description = $championRaw->lore;

        $this->iconURL = $this->_baseUrlIcon . $championRaw->image->full;
        $this->splashURL = $this->_baseUrlSplash . substr($championRaw->image->full, 0, -4) . '_0.jpg';

        $nameSanitized = preg_replace('/\\W/', '', $this->name);
        $this->iconSRC = ICONS . $nameSanitized . '.jpg';
        $this->splashSRC = SPLASHES . $nameSanitized . '.jpg';
    }

    public function getLinks()
    {
        //get mobafire URL
        $mobafire = download(BASE_URL_MOBAFIRESEARCH . urlencode($this->nameLower) . END_URL_MOBAFIRESEARCH);
        preg_match("/href=\"(.*?)\".*?class=\"selected\"/", $mobafire, $mobafire);
        $this->mobafireURL = BASE_URL_MOBAFIRERESULT . $mobafire[1];//the url

        //probuilds URL
        $this->probuildsURL = BASE_URL_PROBUILDS . $this->nameShort;//the url

        //champion.gg URL
        $name = $this->nameShort;
        //special case for wukong
        if ($name === 'Wukong') {
            $name = 'MonkeyKing';//the ur
        }
        $this->championggURL = BASE_URL_CHAMPIONGG . $name;//the url


        //lol wiki
        $name = str_replace(' ', '_', $this->name); //replace spaces with _
        $this->lolwikiURL = BASE_URL_LOLWIKI . $name;
    }

    public function getRole($force = false)
    {
        $inArray = false;

        //load the roles json
        $file=DATA . 'rolesNormal.json';
        if (file_exists($file)) {
            $roles = json_decode(file_get_contents($file));


            //first check if this champion already has roles
            for ($i = 0; $i < 5; $i++) {
                if (in_array($this->_id, $roles[$i])) {
                    $inArray = true;
                    break;
                }
            }
        }

        if ($force || !$inArray) {
            //5 tries max
            for ($i = 0; $i < 5; $i++) {
                //get the roles from champion.gg
                $championPage = download($this->championggURL);
                //get the location of what we need, so we don't need to regex the entire page
                $start = strpos($championPage, 'matchupData.champion') + strlen('matchupData.champion = ');
                $end = strpos($championPage, 'matchupData.generalRole');
                $championPage = trim(substr($championPage, $start, $end - $start));

                //remove the ";" at the end
                $championPage = substr($championPage, 0, -1);

                $championData = json_decode($championPage);
                if (!$championData) {
                    continue;
                }
                $roles = $championData->roles;

                //ok now add the roles
                foreach ($roles as $role) {
                    $this->roles[] = $this->getRoleFromString($role->role);
                }
                break;
            }
            if (!$championData) {
                echo 'Error while getting championgg info for '.$this->name;
            }
        }
    }

    private function getRoleFromString($role)
    {
        switch ($role) {
            case 'TOP':
                return 0;
            case 'JUNGLE':
                return 1;
            case 'MIDDLE':
                return 2;
            case 'DUO_CARRY':
                return 3;
            case 'DUO_SUPPORT':
                return 4;
        }
        return false;
    }

    public function getImages($force = false)
    {
        //download the images
        echo_console($this->name . ' icon', 2);
        if (!file_exists(BASEPATH . $this->iconSRC) || $force == true) {
            download($this->iconURL, BASEPATH . $this->iconSRC, 50, [70, 70]);
        }

        echo_console($this->name . ' splash', 2);
        if (!file_exists(BASEPATH . $this->splashSRC) || $force == true) {
            download($this->splashURL, BASEPATH . $this->splashSRC, 60, [500, 500 * 0.590]);//0.590 is aspect ratio of splashes
        }
    }
}

function download($url, $filename = null, $quality = null, $size = null)
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
    if ($quality === null) {
        return file_put_contents($filename, $return);
    } else {
        //we want to reduce the quality
        if ($size === null) {
            $return = imagecreatefromstring($return);
            // Enable interlancing
            imageinterlace($return, true);
            imagejpeg($return, $filename, $quality);
        } else {
            //reduce the size
            list($width, $height) = getimagesizefromstring($return);
            $src = imagecreatefromstring($return);
            $dst = imagecreatetruecolor($size[0], $size[1]);
            imagecopyresampled($dst, $src, 0, 0, 0, 0, $size[0], $size[1], $width, $height);
            // Enable interlancing
            imageinterlace($dst, true);
            imagejpeg($dst, $filename, $quality);
        }
        return 1;
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


function progressBar($done, $total)
{
    if (VERBOSE <= 0) {
        $percent = round(($done / $total) * 100);
        $bar = "[" . str_repeat("=", $percent);
        $bar = substr($bar, 0, strlen($bar) - 1) . ">"; // Change the last = to > for aesthetics
        $bar .= str_repeat(" ", 100 - $percent) . "] - $percent% - $done/$total";
        echo "$bar\r"; // Note the \r. Put the cursor at the beginning of the line
    }
}