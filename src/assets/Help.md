# Help Documentation for Command Interface

Welcome to the Command Interface! This documentation provides a comprehensive guide to the available commands you can use. Each command is designed to perform specific actions, navigate to different links, or retrieve useful information. 

## Table of Contents
1. [Navigation Commands](#navigation-commands)
2. [Authentication Commands](#authentication-commands)
3. [Utility Commands](#utility-commands)
4. [External Links](#external-links)
5. [Search Commands](#search-commands)
6. [Currency Conversion](#currency-conversion)
7. [Quotes Retrieval](#quotes-retrieval)
8. [Additional Commands](#additional-commands)
9. [Usage Examples](#usage-examples)

## Navigation Commands
These commands allow you to navigate within the application.

| Command | Description |
|---------|-------------|
| `qrimg` | Navigate to QR image utility |
| `state` | Navigate to state management page |
| `type` | Navigate to typing interface |
| `help` | Display this help documentation |
| `login` / `signin` | Navigate to login page |
| `logout` / `signout` | Navigate to logout page |
| `register` / `signup` | Navigate to signup page |
| `terminal`, `cmd`, `bash`, `shell`, `sh` | Open terminal with predefined style |

## Authentication Commands
Use these commands for user authentication actions.

| Command | Description |
|---------|-------------|
| `login`, `signin` | Log in to your account |
| `logout`, `signout` | Log out from your account |
| `register`, `signup` | Create a new account |

## Utility Commands
These commands provide various utility functionalities.

| Command | Description |
|---------|-------------|
| `style <number>` | Set the terminal style (replace `<number>` with desired style ID) |
| `echo <message>` | Print the specified message in the terminal |
| `clear` / `cls` | Clear the terminal history |

## External Links
Navigate to external websites using these commands.

| Command | Description |
|---------|-------------|
| `colab` | Open Google Colab |

### External Links for Specific Services
You can also access specific services through their respective commands:

- **Google**: Use the command followed by your search query (e.g., `google <query>`)
- **YouTube**: Use the command followed by your search query (e.g., `yt <query>`)
- **GitHub**: Search repositories on GitHub (e.g., `gh <query>`)
- **Kaggle**: Search datasets on Kaggle (e.g., `dataset <query>`)

## Search Commands
These commands allow you to perform searches on various platforms.

| Command | Description |
|---------|-------------|
| `perplexity <query>` | Search using Perplexity AI |
| `google <query>` | Search using Google |
| `youtube <query>` | Search videos on YouTube |
| `duckduckgo <query>` / `ddg <query>` / `duck <query>` | Search using DuckDuckGo |
| `github <query>` | Search on GitHub |
| `kaggle <query>` | Search datasets on Kaggle |
| `npm <query>` | Search for packages on npm |
| `pypi <query>` | Search for packages on PyPI |
| `stackoverflow <query>` | Search questions on Stack Overflow |
| `leetcode <query>` | Search problems on LeetCode |

### User Profile Searches
You can also access user profiles directly:

- **LeetCode Profile**: Use the command followed by the username (e.g., `leet.profile <username>`)
- **LinkedIn Profile**: Use the command followed by the username (e.g., `linkedin.profile <username>`)

## Currency Conversion
Convert currencies using the following command:


### Example:
convert 100 USD EUR

This will convert 100 US Dollars to Euros.

## Quotes Retrieval
Retrieve a random quote with this command:
`quote`

This will return a random quote along with its author.

## Additional Commands
You can also use other commands as follows:

### Unknown Commands Handling
If an unknown command is entered, you will receive a message indicating that the command is not recognized.

## Usage Examples
Here are some examples of how to use the commands effectively:

1. **Navigate to Help**:
`help`

2. **Login**:
`login`

3. **Search**:
`google`
`duckduckgo`

4. **AISearch**
`ai`

4. **Convert Currency**:
`convert 50 usd inr`
`convert usd inr 400`

5. **Get a Random Quote**:
`quote`