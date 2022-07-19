# par-ici-tennis (*Paris i tennis*)

Script to automatically book a tennis court (on https://tennis.paris.fr)

## Get started
Create `config.json` file from `config.json.sample` and complete with your preferences.

`location`: a string representing the name of the court - [full list](https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=tennisParisien&view=les_tennis_parisiens)

`date` a string representing a date formated DD/MM/YYYY

`hour` a string representing the starting hour

`court_id` a string representing the court ID — You need to search and inspect Paris Tennis to collect this one prior running the bot

`player` two strings representing the other player full name

To run this project locally, install the dependencies and run the script:

```sh
npm install
npm start
```

To run with a delay - typically when you want to be the first to book for next week at 08:00 AM

```sh
while [ $(date +%H:%M:%S) != "08:00:05" ]; do sleep 1; echo $(date +%H:%M:%S) "wait for it... wait for it"; done; npm start
```
