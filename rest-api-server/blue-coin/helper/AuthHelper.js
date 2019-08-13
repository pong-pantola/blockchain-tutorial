let helper = {}

helper.checkLogin = (username, password) =>{
  if (username == "user1" && password == "abc123")
    return true;
  else
    return false;
}

module.exports = helper