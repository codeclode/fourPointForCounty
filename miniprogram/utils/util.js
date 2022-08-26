var schoolColors = ["red", "orange", "skybule", "green"]

var uploadImgs = function (imgs, folder) {
  return new Promise(async function (resolve, reject) {
    var cloudPaths = [];
    await imgs.forEach(async (img, index) => {
      await wx.cloud.uploadFile({
        cloudPath: folder + "/" + uuid() + img.substring(img.lastIndexOf('.')),
        filePath: img,
        success: (res) => {
          cloudPaths.push(res.fileID)
          if (cloudPaths.length === imgs.length) {
            resolve(cloudPaths)
          }
        }
      })
    });
  })
}
var uuid = function () {
  return new Date().getTime().toString() + '-' + Math.floor(Math.random() * 10000000);
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const changeActivityFormat = function (value, i) {
  let colorsLen = schoolColors.length;
  value.schoolColor = 'bg-' + schoolColors[i % colorsLen];
  if (value.personNumber && value.maxPersonNumber) {
    value.state = value.personNumber / value.maxPersonNumber;
  }
  value.startTime = value.startTime.replace(/[a-z]|.000/ig, " ");
  value.endTime = value.endTime.replace(/[a-z]|.000/ig, " ");
}


module.exports = {
  uuid,
  uploadImgs,
  formatTime,
  changeActivityFormat
}