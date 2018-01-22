PS4 Exploit Host
================

## What is this?
This is an easy way for anyone to host their own exploit for the PS4 on their LAN. features include:
- Hosts your choice of exploit (Specter, IDC, and XVortex included in [releases](https://github.com/Al-Azif/ps4-exploit-host/releases))
- Sends your choice of payload after a successful exploit
- Blocks PSN domains from resolving (Stops accidental updates)
- Serves the 4.05 update to your PS4

If you do not want to host the package youself set your DNS to `108.61.128.158`. This has all of the features listed above except the payload sender. The exploit can be accessed from the `User's Manual` page in your settings.

## Requirements
- [Python 3](https://www.python.org/downloads/) (Only if not using a binary release)
- Root Privileges (Non-Windows)

## How to download
- Download the zip on the [releases](https://github.com/Al-Azif/ps4-exploit-host/releases) page
- Download with Git, be sure to grab the submodules

    `git clone --recursive https://github.com/Al-Azif/ps4-exploit-host.git`

## How to run
0. Make sure you have Python 3 installed (If not using a binary release)
1. Download the files (As shown in the "How to download" section above)
2. Double click the executable (`ps4-exploit-host.exe`, `start.py`, etc)
    - Alteratively run it from the command line (`ps4-exploit-host.exe`, `./ps4-exploit-host`, `python start.py`, etc)
    - If it starts with no errors, note the IP given
4. On your PS4 `Settings > Network > Setup Network` when you get to DNS Settings select `Manual` set the IP address noted above as the Primary and Secondary DNS
5. Make sure the PS4 is on firmware version 4.05 (`Settings > System > System Information`). If it is not use the jump to the "How to use the Updater" section before continuing
6. On the PS4, go to `Settings > User's Guide` and select it. The exploit should run and there should be output on the script window.
7. The script will prompt you to choose a payload to send. You may send the integrated payload or any payloads located in the `payload` folder.
8. When done use `Ctrl+C` to cleanly close the application

## How to use the updater
0. Follow the "How to run" section for your OS until it says to come here
1. Put the system update in the `updates` folder as `PS4UPDATE_SYSTEM.PUP`
    - Optionally put the recovery update in the `updates` folder as `PS4UPDATE_RECOVERY.PUP`

        **SYS SHA-256:** D0C46E3CAADE956CABCBD20313A8EAB48DDBF3BC3129F3144926BECCFE3D36C4

        **REC SHA-256:** B74CE16802CD7EC05158C1035E09A3131BC1D489DA2B4EF93B2C6029D9CA2BFA

2. MAKE SURE THE DNS IS SET CORRECTLY!
3. **SEE #3 I'M SO SERIOUS!**
4. There should be a different page on the `System Software Update > View Details` option on the PS4. It'll be obvious!
    - The PS4 isn't using the right DNS if you get the standard Sony changelog page. **STOP IMMEDIATELY AND RESTART THE ENTIRE PROCESS**
5. Run a system update on your PS4 system.
6. Return to the "How to run" section

## Other Flags
- Use the `--debug` flag to turn on the DNS & HTTP server output. This will make it hard to use the script normally as it'll push the payload menu off the screen
- Use the `--dns_only` flag to only run the DNS server (Disables HTTP server, the payload sender is also disabled as this depends on the HTTP server).
- Use the `--http_only` flag to only run the HTTP server (Disables DNS server).
- Use the `--daemon` flag to automatically send the integrated payload (No payload menu will be shown)
- Use the `--autosend` flag to automatically send the like-named payload from the payloads directory (No payload menu will be shown)

        ex. sudo python3 start.py --autosend debug_settings.bin

## Troubleshooting

#### Script Related
Before seeking help run though the following list:
- Use the most recent release. Feel free to believe that the Python 2 release works better... I **won't** support it anymore.
    - "The Python 3 release cause a kernel panic, but the Python 2 release works." **The exploit sent is the same, you just got unlucky, try again...**
- Follow the directions exactly, don't try to get fancy then come for help
- **If the server starts (It gives you an IP and hasn't errored out) and you can't connect from your PS4 with 99.99% certainty your firewall/anit-virus is blocking it. This accounts for nearly all of the issues users have. I'm getting real tired of me saying it's the firewall and after an hour remote troubleshooting (Which is not fun) it ends up being the firewall like I said in the first place**
- In your command prompt run `python --version` or `python3 --version` to make sure you have Python 3 installed correctly
- Disable other networking apps that may interfere with the script (Skype, Discord, Torrent Clients, XAMPP, Firewalls, etc)
- It is normal to get some errors (PSN & NAT) while running the network test. This proves the PSN domains are blocked correctly.


#### Exploit/Payload Related
These are NOT related to this script in any way, but rather the exploits/payloads themselves:
- Make sure your PS4's firmware is on 4.05 exactly. There is no downgrading. If you are above 4.05 you're out of luck for now.
- Sending multiple payloads doesn't always work (Exploit may not be set up for it).
- The PS4 can get a kernel panic and just shutoff. Physically unplug the power for a second, then power it back on.
- "Out of Memory" errors while loading the exploit page are normal, restart your PS4 if you get a lot of them in a row.
- The integrated FTP Payload takes a minute to start the FTP server. Be patient and try again in a few seconds.
- Other FTP payloads must be compiled or hex edited with your PS4's/Computer's IP.
- FTP payloads do not have full access under Specter's exploit.
- You must leave the exploit page open for FTP to work.
- IDC's exploit page doesn't completely load even when it works.

## Contributing
You can check the [issue tracker](https://github.com/Al-Azif/ps4-exploit-host/issues) for my to do list and/or bugs. Feel free to send a [pull request](https://github.com/Al-Azif/ps4-exploit-host/pulls) for whatever.
Be sure to report any bugs, include as much information as possible.

## What if a new exploit is released?
You should just be able to place the exploit files in the `exploit` directory. The exploit will automatically add the exploit to the menu.

        ex. exploit/new_exploit/index.html

## Why do you commit so many little changes, tweaks, etc?
I have no self control... it also lets people see the actual development. From barely working chicken scratch to actual code.

## Credits
- Specter, IDC, qwertyoruiopz, Flatz, CTurt, Mistawes, XVortex, Anonymous, crypt0s, etc
