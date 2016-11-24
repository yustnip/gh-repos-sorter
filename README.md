# gh-repos-sorter

Command line tool for sorting a list of GitHub repositories by stars.

## Usage

1. `git clone ...`
2. `npm i`
3. For starting sorting use the following command from the tool directory:

```
node sorter LIST_FILE CLIENT_ID_OPTIONAL CLIENT_SECRET_OPTIONAL
```

Where:
`LIST_FILE` - a path to the file with a list of URLs of GitHub repositories.
`CLIENT_ID_OPTIONAL` - GitHub OAuth Client ID
`CLIENT_SECRET_OPTIONAL` - GitHub OAuth Client Secret

4. The sorted repos list will be saved in `repos.txt`, which will be generated to the current directory.

The list will be composed as a simple text (stars are indicated in parentheses):

```
https://github.com/ReactTraining/react-router (17706)
https://github.com/afollestad/material-dialogs (7947)
https://github.com/reactotron/reactotron (4899)
...
```
