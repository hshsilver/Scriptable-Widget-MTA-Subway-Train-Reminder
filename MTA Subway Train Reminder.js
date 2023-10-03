// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: bell;


// Silver 23.10.2
// Version1.0
// Display NYC Subway Station Train Schedule in Simplified Two Directions.



//Two Favorite Location Here
let myF1="(40.6922632, -73.9868766)" //default: Jay St MetroTech
let myF2="(40.7523914, -73.9775082)" //default: Grand Central-42 St
let myF3="(40.7468117, -73.8910024)" //default: Jackson Hts-Roosevelt Av



// 创建一个小组件
const widget = new ListWidget();
const widgetSize = config.widgetFamily;

// 读取传入参数
const widgetParameter = args.widgetParameter;

// 定义一个函数来解析经纬度字符串
function parseCoordinates(coordinateString) {
  // 定义经纬度的正则表达式
  const regex = /\(([-+]?\d+\.\d+), ([-+]?\d+\.\d+)\)/;
  const matches = coordinateString.match(regex);

  if (matches && matches.length === 3) {
    // 第一个匹配是整个字符串，第二个和第三个匹配是经度和纬度
    const latitude = parseFloat(matches[1]);
    const longitude = parseFloat(matches[2]);
    return { latitude, longitude };
  } else {
    console.log("无法解析经纬度字符串。");
    return null;
  }
}



let url;

// 检查传入参数
if(widgetParameter===null){
  // 在这里添加你的其他逻辑或默认值的 URL
    // 获取当前位置的经纬度
    const location = await Location.current();
    const latitude = location.latitude;
    const longitude = location.longitude;

    // 构建 API 请求链接
    url = `https://api.wheresthefuckingtrain.com/by-location?lat=${latitude}&lon=${longitude}`;
        
}else if (widgetParameter === "1") {
  // 如果参数是 "1"，使用经纬度 
  const coordinates = parseCoordinates(myF1);
  if (coordinates) {
    url = `https://api.wheresthefuckingtrain.com/by-location?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  }
} else if (widgetParameter === "2") {
  // 如果参数是 "2"，使用经纬度
  const coordinates = parseCoordinates(myF2);
  if (coordinates) {
    url = `https://api.wheresthefuckingtrain.com/by-location?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  }
} else if (widgetParameter === "3") {
  // 如果参数是 "2"，使用经纬度
  const coordinates = parseCoordinates(myF3);
  if (coordinates) {
    url = `https://api.wheresthefuckingtrain.com/by-location?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  }
} else {
  // 如果不是 "1" 或 "2"，尝试解析传入参数为经纬度
  const coordinates = parseCoordinates(widgetParameter);
  if (coordinates) {
    url = `https://api.wheresthefuckingtrain.com/by-location?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  } else {
    console.log("传入的参数无法解析，将使用默认值或其他逻辑。");
    // 在这里添加你的其他逻辑或默认值的 URL
    // 获取当前位置的经纬度
    const location = await Location.current();
    const latitude = location.latitude;
    const longitude = location.longitude;

    // 构建 API 请求链接
    url = `https://api.wheresthefuckingtrain.com/by-location?lat=${latitude}&lon=${longitude}`;
        
  }
}

// 使用生成的 URL 进行后续操作
console.log(`使用的 URL：${url}`);










widget.addSpacer();



const request = new Request(url);
const response = await request.loadJSON();

// 解析数据
const station = response.data[0];
const stationName = station.name;

// 获取当前时间
const now = new Date();

// 解析并格式化时间函数
function formatTime(timeString) {
  const time = new Date(timeString);
  const minutesRemaining = Math.floor((time - now) / (60 * 1000));
  return `${minutesRemaining} 分`;
}


// 定义线路颜色映射
const routeColors = {
  "A": Color.blue(),
  "C": Color.blue(),
  "E": Color.blue(),
  "B": Color.orange(), // 橙色
  "D": Color.orange(), // 橙色
  "F": Color.orange(), // 橙色
  "FX": Color.orange(), // 橙色
  "M": Color.orange(), // 橙色
  "N": Color.yellow(),
  "Q": Color.yellow(),
  "R": Color.yellow(),
  "W": Color.yellow(),
  "S": Color.gray(), // 银色
  "FS": Color.gray(), // 银色，有可能不是这个，有可能是SF
  "H": Color.gray(), // 银色，SR的代号
  "L": Color.darkGray(), // 深灰色
  "1": Color.red(),
  "2": Color.red(),
  "3": Color.red(),
  "4": Color.green(),
  "5": Color.green(),
  "6": Color.green(),
  "6X": Color.green(),
  "7": Color.purple(),
  "7X": Color.purple(),
  "J": Color.brown(), // 棕色
  "Z": Color.brown(), // 棕色
  "SI": Color.cyan(), // 天蓝色
  "G": Color.green() // 亮绿色
};



// if(widgetSize!="medium"){
//   widget.addSpacer()
// }

// widget.addSpacer()



// // ？？？？？？？
// //代码有问题，只有小尺寸显示，且不是居中的
// // 定义矩形的宽度和高度
// const rectWidth = 300; // 矩形的宽度（单位为点）
// const rectHeight = 2; // 矩形的高度（单位为点）

// // 计算横线的居中位置
// const centerX = widget.size.width / 2 - rectWidth / 2;
// const centerY = widget.size.height / 2 - rectHeight / 2;

// // 创建一个画布
// const ctx = new DrawContext();
// ctx.size = new Size(widget.size.width, widget.size.height);

// // 绘制白色矩形
// ctx.setFillColor(Color.white());
// ctx.fillRect(new Rect(centerX, centerY, rectWidth, rectHeight));

// // 将画布添加到小组件
// widget.addImage(ctx.getImage());







// 添加站点名称到小组件
const titleText = widget.addText(`${stationName}`);
titleText.textColor = Color.white();
titleText.centerAlignText();
if (widgetSize === "small") {
  titleText.font = Font.boldSystemFont(14);
}else if(widgetSize==="medium"){
  titleText.font = Font.boldSystemFont(20);
}else{
  titleText.font = Font.boldSystemFont(32);
}

// if(widgetSize!="medium"){
//   widget.addSpacer()
// }
widget.addSpacer()



const myStack = widget.addStack();
myStack.layoutHorizontally();

if(widgetSize==="small"){
  myStack.setPadding(0,5,0,5);
}



// myStack.addSpacer()
if(widgetSize!="small"){
  myStack.addSpacer()

}



// 创建左侧堆栈并添加北向列车信息
const leftStack = myStack.addStack();
leftStack.layoutVertically();
// leftStack.addText(`北向列车`);


let displayNumber
if (widgetSize === "small") {
  displayNumber = 5
}else if(widgetSize==="medium"){
  displayNumber = 5
}else{
  displayNumber = 10
}
station.N.slice(0, displayNumber).forEach(train => {
  const routeColor = routeColors[train.route] || Color.white();
  const formattedTime = formatTime(train.time);
  // const trainTextItem = leftStack.addText(`● ${train.route}: ${formattedTime}`);
  const trainTextItem = leftStack.addText(`▲ ${train.route}: ${formattedTime}`);
  trainTextItem.textColor = routeColor;
  if (widgetSize === "small") {
    trainTextItem.font = Font.systemFont(10);
  }else if(widgetSize==="medium"){
    trainTextItem.font = Font.systemFont(16);
  }else{
    trainTextItem.font = Font.systemFont(20);
  }
});




if(widgetSize!="medium"){
  myStack.addSpacer()
}


if(widgetSize==="medium"){
  const temp = myStack.addStack()
  temp.layoutVertically();
  temp.centerAlignContent();
  temp.size = new Size(100, 0);
  const d = temp.addDate(now)
  d.applyRelativeStyle();
  d.textColor = Color.gray();
  d.font = Font.footnote();
  d.centerAlignText();
  // d.padding(10,5,10,5)


}




// 创建右侧堆栈并添加南向列车信息
const rightStack = myStack.addStack();
rightStack.layoutVertically();
// rightStack.addText(`南向列车`);
station.S.slice(0, displayNumber).forEach(train => {
  const routeColor = routeColors[train.route] || Color.white();
  const formattedTime = formatTime(train.time);
  const trainTextItem = rightStack.addText(`▼ ${train.route}: ${formattedTime}`);

  trainTextItem.textColor = routeColor;
  // trainTextItem.font = Font.systemFont(14);
  if (widgetSize === "small") {
    trainTextItem.font = Font.systemFont(10);
  }else if(widgetSize==="medium"){
    trainTextItem.font = Font.systemFont(16);
  }else{
    trainTextItem.font = Font.systemFont(20);
  }
});



if(widgetSize!="small"){
  myStack.addSpacer()

}

if(widgetSize!="medium"){
  widget.addSpacer()
}



//废弃的早期时效性
// // 获取上一次更新的时间并计算时间差
// const lastUpdateTime = new Date(response.updated);
// const timeDifference = Math.abs(now - lastUpdateTime);

// // 计算分钟和秒数
// const minutesSinceUpdate = Math.floor(timeDifference / (60 * 1000));
// const secondsSinceUpdate = Math.floor((timeDifference % (60 * 1000)) / 1000);


// const formattedLastUpdateTime = `${lastUpdateTime.getFullYear()}-${(lastUpdateTime.getMonth() + 1).toString().padStart(2, '0')}-${lastUpdateTime.getDate().toString().padStart(2, '0')} ${lastUpdateTime.getHours().toString().padStart(2, '0')}:${lastUpdateTime.getMinutes().toString().padStart(2, '0')}:${lastUpdateTime.getSeconds().toString().padStart(2, '0')}`;


// // 格式化上次更新时间
// const lastUpdateText = `于${minutesSinceUpdate} 分 ${secondsSinceUpdate} 秒前`;
// const lastUpdateText2 = `${formattedLastUpdateTime}更新`










if(widgetSize==="small"){
  const d = widget.addDate(now)
d.applyRelativeStyle();
d.textColor = Color.gray();
d.font = Font.footnote();
d.centerAlignText();
}else if(widgetSize==="medium"){

}else{
  str = widget.addText("距上一次更新过去了")
  str.textColor = Color.gray();
  str.font = Font.footnote();
  str.centerAlignText();


  const d = widget.addDate(now)
  d.applyRelativeStyle();
  d.textColor = Color.gray();
  d.font = Font.footnote();
  d.centerAlignText();


}











widget.addSpacer()


//发现渐变背景不好看，废弃
// let gradient = new LinearGradient()
//   gradient.locations = [0, 1]
//   gradient.colors = [
//     new Color("#242424"),
//     new Color("#484848")
//   ]
// widget.backgroundGradient = gradient




widget.backgroundColor = new Color("#242424");
const padding = 10;
widget.setPadding(padding, padding, padding, padding);




//尝试更快刷新，但是最终决定权还是在系统，通常在1m~1h之间不等
let nextRefresh = Date.now() + 1000*30 // add 30 second to now
widget.refreshAfterDate = new Date(nextRefresh)

// 显示小组件
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  // widget.presentMedium();
  widget.presentLarge();
}

Script.complete();
