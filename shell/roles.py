from unicurses import *
import os
import json
import sys

if (len(sys.argv) > 2 or len(sys.argv) == 1):
    print 'Usage: roles.py { strict | normal | loose }'
    sys.exit(1)
if str(sys.argv[1]) == 'strict':
    datafilename = 'rolesStrict.json'
elif str(sys.argv[1]) == 'normal':
    datafilename = 'rolesNormal.json'
elif str(sys.argv[1]) == 'loose':
    datafilename = 'rolesLoose.json'
else:
    print 'Usage: roles.py { strict | normal | loose }'
    sys.exit(1)

#get the champions
basepath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
#print basepath

f = open(basepath+'/data/champions.json', 'r')
champions = json.loads(f.read())
i = 0


def getChoices():
    global n_choices
    retur = [str(champions[i]['name']),
             "[ ] Top", "[ ] Jungle", "[ ] Mid", "[ ] ADC", "[ ] Support"]
    if roles[i][0]:
        retur[1] = "[X] Top"
    if roles[i][1]:
        retur[2] = "[X] Jungle"
    if roles[i][2]:
        retur[3] = "[X] Mid"
    if roles[i][3]:
        retur[4] = "[X] ADC"
    if roles[i][4]:
        retur[5] = "[X] Support"
    n_choices = 6
    return retur


def saveChoices():
    rolesSave = [[], [], [], [], []]
    for role in range(0, 5):
        for champId, champRoles in enumerate(roles):
            if champRoles[role]:
                rolesSave[role].append(champId)
    with open(basepath+'/data/'+datafilename, 'w') as outfile:
        json.dump(rolesSave, outfile)
    return

#init roles
roles = []
for index in range(0, len(champions)):
        roles.append([False, False, False, False, False])

if os.path.isfile(basepath+'/data/'+datafilename):
    f = open(basepath+'/data/'+datafilename, 'r')
    roles_temp = json.loads(f.read())
    for role in range(0, 5):
        for champId in roles_temp[role]:
            roles[champId][role] = True

WIDTH = 30
HEIGHT = 10
startx = 0
starty = 0

choices = getChoices()

highlight = 2
choice = 0
c = 0


def print_menu(menu_win, highlight):
    x = 2
    y = 2
    box(menu_win, 0, 0)
    for i in range(0, n_choices):
        if (highlight == i + 1):
            wattron(menu_win, A_REVERSE)
            mvwaddstr(menu_win, y, x, choices[i])
            wattroff(menu_win, A_REVERSE)
        else:
            mvwaddstr(menu_win, y, x, choices[i])
        y += 1
    wrefresh(menu_win)

stdscr = initscr()
clear()
noecho()
cbreak()
curs_set(0)
startx = int((80 - WIDTH) / 2)
starty = int((24 - HEIGHT) / 2)

menu_win = newwin(HEIGHT, WIDTH, starty, startx)
keypad(menu_win, True)
mvaddstr(0, 0, "Use arrow keys to go up and down, press SPACE to select a choice, press -> to go the the next champion, press <- to go the previous champion. Press q to open menu, press q again to close menu.")
refresh()
print_menu(menu_win, highlight)
in_exit = False

while True:
    c = wgetch(menu_win)
    if c == KEY_UP:
        if highlight == 2:
            highlight = n_choices
        else:
            highlight -= 1
    elif c == KEY_DOWN:
        if highlight == n_choices:
            highlight = 2
        else:
            highlight += 1
    elif c == 32:   # SPACE is pressed
        choice = highlight

        #update the roles
        if roles[i][choice-2]:
            roles[i][choice-2] = False
        else:
            roles[i][choice-2] = True

        choices = getChoices()
        clrtoeol()
        refresh()
    elif c == 261:   # go to next champion
        if in_exit:
            continue
        i += 1
        if i == len(champions):
            i = 0
        choices = getChoices()
        wclear(menu_win)
        clrtoeol()
        refresh()
    elif c == 260:   # go to next champion
        if in_exit:
            continue
        i -= 1
        if i == -1:
            i = len(champions)-1
        choices = getChoices()
        wclear(menu_win)
        clrtoeol()
        refresh()
    elif c == 113:   # go to exit menu
        if in_exit:
            choices = getChoices()
            in_exit = False
        else:
            choices = ['', 'Save', 'Save & Exit', 'Clear', 'Exit']
            n_choices = 5
            highlight = 2
            in_exit = True
        wclear(menu_win)
        clrtoeol()
        refresh()
    #do something in exit menu
    elif c == 10:
        if not in_exit:
            continue
         #Save
        if highlight == 2:
            refresh()
            saveChoices()
            mvaddstr(23, 0, str.format("Saved"))
            clrtoeol()
            refresh()
        #save&exit
        elif highlight == 3:
            saveChoices()
            break
         #clear
        elif highlight == 4:
            #empty everything
            roles = []
            for index in range(0, len(champions)):
                roles.append([False, False, False, False, False])
            mvaddstr(23, 0, str.format("Cleared"))
            clrtoeol()
            refresh()
        #exit
        elif highlight == 5:
            break
    print_menu(menu_win, highlight)
refresh()
endwin()
