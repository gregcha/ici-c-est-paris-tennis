# Ici c'est Paris Tennis

Script to automatically book a tennis court (on https://tennis.paris.fr)

Credit goes to [Bertrand d'Aure](https://github.com/bertrandda) who built [par-ici-tennis](https://github.com/bertrandda/par-ici-tennis) in the first place.

## Get started
Create `config.json` file from `config.json.sample` and complete with your preferences.

`location` a string representing the name of the court — [full list](https://airtable.com/shrNCuXYBTcjQBg7X)

`date` a string representing a date formated DD/MM/YYYY — eg: "24/11/2022"

`hour` a string representing the starting hour formated HH — eg: "08"

`court_id` a string representing the court ID — [find Court ID here](https://airtable.com/shrH4BCvssntJn9oB/tblMzdkwf9fNEztGy)

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
