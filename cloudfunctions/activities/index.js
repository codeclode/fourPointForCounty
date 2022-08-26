// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database({
  env: "cloudforcountry-2gm8byjtf2db1e54"
});
const $ = db.command.aggregate;
const _ = db.command;
var getAllActivities = async function (pageNumber) {
  var ret;
  await db.collection("activities").skip((pageNumber - 1) * 10).limit(10).get().then(res => {
    ret = res.data;
  })
  return ret;
}
var getActivityById = async function (id) {
  var ret;
  await db.collection("activities").where({
    _id: id
  }).get().then(res => {
    ret = res.data[0]
  });
  return ret
}
var getActivityByIds = async function (ids) {
  var ret = [];
  for (var i = 0; i < ids.length; i++) {
    var act = await getActivityById(ids[i]);
    ret.push(act)
  }
  return ret;
}
var getActivityByKeyword = async function (keyWord, pageNumber) {
  var ret;
  await db.collection("activities").where(_.or([{
      name: db.RegExp({
        regexp: keyWord,
        options: "i"
      })
    },
    {
      school: db.RegExp({
        regexp: keyWord,
        options: "i"
      })
    }
  ])).skip((pageNumber - 1) * 10).limit(10).get().then(res => {
    ret = res.data
  });
  return ret;
}
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var {
    pageNumber,
    keyWord,
    id,
    inpart,
    activitiesID,
  } = event;
  if (pageNumber && keyWord == undefined) {
    var activities = await getAllActivities(pageNumber);
    return activities;
  } else if (pageNumber && keyWord) {
    console.log(keyWord);
    var activities = await getActivityByKeyword(keyWord, pageNumber);
    return activities;
  } else if (id && !inpart) {
    var activity = await getActivityById(id);
    return activity;
  } else if (inpart) {
    var ret;
    await db.collection("usersInfo").where({
      open_id: wxContext.OPENID
    }).update({
      data: {
        activities: _.unshift(id)
      }
    }).catch(res => {
      ret = "error"
    })
    return ret;
  } else if (activitiesID) {
    var activities = [];
    activities = await getActivityByIds(activitiesID);
    return activities;
  }
}