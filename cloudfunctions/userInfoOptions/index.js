// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "cloudforcountry-2gm8byjtf2db1e54"
});
const $ = db.command.aggregate;
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext();
  var {
    userInfo,
    rankPage
  } = event;
  if (rankPage === undefined) {
    await db.collection("usersInfo").where({
      open_id: OPENID
    }).get().then(res => {
      if (res.data.length === 0) {
        db.collection("usersInfo").add({
          data: {
            open_id: OPENID,
            donateScore: 0,
            activities: [],
            products: [],
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          }
        }).then(res => {
          userInfo = res;
        })
      } else {
        userInfo = res.data[0];
      }
    });
    await db.collection("usersInfo").aggregate().match({
      donateScore: _.gt(userInfo.donateScore)
    }).count("count").end().then(res => {
      userInfo.rank = res.list[0] ? res.list[0].count : 1
    });
    return userInfo;
  }else{
    var userList;
    await db.collection("usersInfo").orderBy("donateScore","desc").skip((rankPage-1)*10).limit(10)
    .get().then(res=>{
      userList = res.data;
    })
    return userList;
  }

}