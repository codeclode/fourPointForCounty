// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database({
  env: "cloudforcountry-2gm8byjtf2db1e54"
});
const $ = db.command.aggregate;
const _ = db.command;
const searchAllActivities = async function (pageNumber) {
  var ret;
  await db.collection("products").skip((pageNumber - 1) * 10).limit(10).get().then(res => {
    ret = res.data;
  }).catch(err => {
    ret = "error"
  })
  return ret;
}

const getProductsByType = async function (pageNumber, type, keyword) {
  var ret;
  console.log(type, keyword);
  await db.collection("products").where(_.and([
    _.or([{
      name: db.RegExp({
        regexp: keyword,
        options: "i"
      })
    }, {
      tags: _.elemMatch(_.eq(keyword)),
    }, ]), _.or([{
      tags: _.elemMatch(_.eq(type)),
    }, {
      name: db.RegExp({
        regexp: type,
        options: "i"
      })
    }]),
  ])).skip((pageNumber - 1) * 10).limit(10).get().then(res => {
    ret = res;
  }).catch((err) => {
    console.log(err);
    ret = "error"
  })
  return ret.data;
}

const getProductByID = async function (ID) {
  var ret;
  await db.collection("products").doc(ID).get().then(res => {
    ret = res;
  }).catch(() => {
    ret = "error";
  });
  return ret.data;
}

const getProductByIDs = async function (ids) {
  var ret = [];
  for (var i = 0; i < ids.length; i++) {
    var product = await getProductByID(ids[i]);
    ret.push(product);
  }
  return ret;
}

const deleteProduct = async function (id, userId) {
  var ret = "success"
  await db.collection("products").doc(id).remove().then(async () => {
    await db.collection("usersInfo").where({
      open_id: userId
    }).update({
      data: {
        products: _.pull(id)
      }
    })
  }).catch(() => {
    ret = "error";
  })
  return ret;
}

const updateProduct = async function (productData, id) {
  var ret = "success";
  await db.collection("products").doc(id).update({
    data: productData
  }).catch((err) => {
    console.log(err);
    ret = "error"
  });
  return ret;
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  const wxContext = cloud.getWXContext()
  var {
    productData,
    keyword,
    type,
    productID,
    productsID,
    deleteOption,
    pageNumber,
    update
  } = event;
  if (productData && productID == undefined && !update) {
    var ret;
    productData.userId = wxContext.OPENID;
    await db.collection("products").add({
      data: productData
    }).then(res => {
      console.log(res);
      db.collection("usersInfo").where({
        open_id: wxContext.OPENID
      }).update({
        data: {
          products: _.push([res._id])
        }
      })
    }).then(() => {
      ret = "success"
    }).catch(() => {
      ret = "error"
    })
    return ret;
  } else if (productData && update && productID) {
    return await updateProduct(productData, productID);
  } else if (pageNumber && ((type == undefined && keyword == undefined) || (type == '' && keyword == ''))) {
    res = await searchAllActivities(pageNumber);
    if (res == "error") {
      return "error"
    } else {
      return res;
    }
  } else if (pageNumber && (type !== '' || keyword !== '')) {
    if (type !== '' && keyword === '') keyword = type;
    if (keyword !== '' && type === '') type = keyword;
    res = await getProductsByType(pageNumber, type, keyword);
    return res;
  } else if (productID && !deleteOption) {
    return await getProductByID(productID);
  } else if (productsID) {
    return await getProductByIDs(productsID);
  } else if (deleteOption) {
    return deleteProduct(productID, wxContext.OPENID);
  }
}