// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database({
  env: "cloudforcountry-2gm8byjtf2db1e54"
});

const getSwiper = async function () {
  var ret;
  await db.collection("swipers").orderBy("data","desc").limit(3).get().then(res => {
    ret = res.data;
  }).catch(()=>{
    ret = "error"
  });
  return ret;
}

exports.main = async (event, context) => {
  const {
    option
  } = event;
  if (option === "getSwiper") {
    return await getSwiper();
  }
}