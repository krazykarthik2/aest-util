function styleHelp() {
  return `
    HELP:
      styles:1-8
      syntax::: 
      style 'styleID'
  `;
}
export function handleCommand(cmd, navigate, dispatch, clearHistory) {
  if (!cmd || !navigate || !dispatch || !clearHistory) return;
  
  let [action, ...args] = cmd.split(" ")

  console.log('$$$$$$',action)
  if (action.startsWith("?")) {
    navigate("?"+action.substr(1)+(action.substr(1)&&args.join('')?"%20":"")+args.join("%20"));
    return null;
  }
  action = action.replaceAll(/[^a-zA-Z0-9.]+/g, "");
  if (action.includes("style")) {
    if (action.includes("clock.style")) {
      let styleParam = args.join("").replaceAll(/[^a-zA-Z0-9]+/g, "");
      navigate("/clock?style=" + styleParam);
    } else {
      let styleParam = args.join("").replaceAll(/[^a-zA-Z0-9]+/g, "");
      if (styleParam) navigate("?style=" + styleParam);
      else return styleHelp();
    }
  } else {
    switch (action.toLowerCase()) {
      case "echo":
        return args.join(' ')
        break
      case "qr":
        navigate("/qr");
        break;
      case "state":
        navigate("/state");
        break;
      case "type":
        navigate("/typing");
        break;
      case "login":
        navigate("/login");
        break;
      case "signout":
      case "logout":
        navigate("/logout");
        break;
      case "register":
      case "signup":
        navigate("/signup");
        break;
      case "clear":
      case "cls":
        dispatch(clearHistory());
        return null;
        break;
      case "auth.totp.enable":
        navigate("/enable-totp");
        break;
      default:
        // Handle other commands or show error
        return `Unknown command: ${cmd}`;
    }
  }
  return `command executed:${action}`;
}
