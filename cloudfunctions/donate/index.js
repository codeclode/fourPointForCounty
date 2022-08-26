// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "cloudforcountry-2gm8byjtf2db1e54"
})

const $ = db.command.aggregate;
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var {
    donateDate
  } = event;
  donateDate.userId = wxContext.OPENID;
  var ret = true;
  await db.collection("donatesInfo").add({
    data: donateDate
  }).catch(res => {
    ret = false
  })

  if (ret) {
    return donateDate
  }else{
    return "error"
  }
}