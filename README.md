# insomnia-plugin-gql-fragments

An [Insomnia](https://insomnia.rest) Plugin Hack into Insomnia to support GQL Fragments. Use the body of a new empty request and add the fragment to the body. Where you want to use fragment in gql the following : {% fragment 'req_12345' %}. Fragments can be duplicated or never used in the request body, they will be removed in the request hooks..

## Use-Case



## Installation

Install the `insomnia-plugin-gql-fragments` plugin from Preferences > Plugins.

## How to Use It


## Development

Create a `.env` file in this repo with the following contents:
```
# Set to the location of the insomnia plugins folder (in Insomnia, go to
# Preferences -> Plugins, then click Reveal Plugins Folder)
# Default values are:
# MacOS: ~/Library/Application\ Support/Insomnia/plugins/
# Windows: %APPDATA%\Insomnia\plugins\
# Linux: $XDG_CONFIG_HOME/Insomnia/plugins/ or ~/.config/Insomnia/plugins/
PLUGINS_DIRECTORY=/mnt/c/Users/your_username/AppData/Roaming/insomnia/plugins
```

To install the plugin into Insomnia locally, run `install-plugin.sh`, then
refresh plugins in Insomnia or restart Insomnia.
