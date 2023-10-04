// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: bell;


// Silver 23.10.4
// Version 2.0
// Display NYC Subway Station Train Schedule in Simplified Two Directions.



//Two Favorite Location Here
let myF1="(40.6922632, -73.9868766)" //default: Jay St MetroTech
// let myF2="(40.7523914, -73.9775082)" //default: Grand Central-42 St
let myF2="(40.755356, -73.987042)" //default: Times Sq–42 St
let myF3="(40.7468117, -73.8910024)" //default: Jackson Hts-Roosevelt Av



// 创建一个小组件
const widget = new ListWidget();
const widgetSize = config.widgetFamily;

// 读取传入参数
const widgetParameter = args.widgetParameter;

// 定义一个函数来解析经纬度字符串
function parseCoordinates(coordinateString) {
  // 定义经纬度的正则表达式
  const regex = /\(([-+]?\d+\.\d+),([-+]?\d+\.\d+)\)/;
  const matches = coordinateString.replace(/\s/g, "").match(regex);
  

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


var routes = station.routes;

// 打印数组
console.log(routes);

// 定义排序顺序的映射
var sortOrder = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "6X": 7,
  "7": 8,
  "7X": 9,
  "A": 10,
  "C": 11,
  "E": 12,
  "SI": 13,
  "B": 14,
  "D": 15,
  "F": 16,
  "FX": 17,
  "M": 18,
  "N": 19,
  "Q": 20,
  "R": 21,
  "W": 22,
  "J": 23,
  "Z": 24,
  "G": 25,
  "L": 26,
  "S": 27,
  "H": 28,
  "FS": 29
};

// 使用排序顺序映射进行排序
routes.sort(function(a, b) {
  return sortOrder[a] - sortOrder[b];
});

// 打印排序后的数组
console.log(routes);


// // 替换"H"为"SR"，"FS"为"SF"
// for (var i = 0; i < routes.length; i++) {
//   if (routes[i] === "H") {
//       routes[i] = "SR";
//   } else if (routes[i] === "FS") {
//       routes[i] = "SF";
//   }
// }

// // 打印排序并替换后的数组
// console.log(routes);




// 获取当前时间
const now = new Date();
const systemLanguage = Device.language();
let strLan = ""
let strNow = ""
// 检测语言是否为中文
if (systemLanguage.startsWith("zh")) {
  // 执行操作A，例如
  strLan="分"
  strNow="现在"
} else {
  strLan="Min"
  strNow="Due"
}
// 解析并格式化时间函数
function formatTime(timeString) {
  const time = new Date(timeString);
  const minutesRemaining = Math.floor((time - now) / (60 * 1000));
  if(minutesRemaining ===0){
    return strNow;
  }
  return `${minutesRemaining} ${strLan}`;
}


// 真实颜色如下，但是直接放到UI里和背景不和谐，考虑浅色背景再应用
// A: new Color("0039a6"),
// F:ff6319
// G:6cbe45	
// L:a7a9ac	
// J:996633	
// Q:fccc0a	
// 1:ee352e
// 4:00933c
// 7:b933ad	
// T:00add0	
// S:808183


// // 定义线路颜色映射，上调两个等级的颜色
// const routeColors = {
//   "A": new Color("6D7AE8"), // 上调两个等级的颜色
//   "C": new Color("6D7AE8"), // 上调两个等级的颜色
//   "E": new Color("6D7AE8"), // 上调两个等级的颜色
//   "B": new Color("FFBB78"), // 上调两个等级的颜色，橙色
//   "D": new Color("FFBB78"), // 上调两个等级的颜色，橙色
//   "F": new Color("FFBB78"), // 上调两个等级的颜色，橙色
//   "FX": new Color("FFBB78"), // 上调两个等级的颜色，橙色
//   "M": new Color("FFBB78"), // 上调两个等级的颜色，橙色
//   "N": new Color("FFEE5C"), // 上调两个等级的颜色
//   "Q": new Color("FFEE5C"), // 上调两个等级的颜色
//   "R": new Color("FFEE5C"), // 上调两个等级的颜色
//   "W": new Color("FFEE5C"), // 上调两个等级的颜色
//   "S": new Color("C9CBD2"), // 上调两个等级的颜色，银色
//   "FS": new Color("C9CBD2"), // 上调两个等级的颜色，银色
//   "H": new Color("C9CBD2"), // 上调两个等级的颜色，银色
//   "L": new Color("E9E9F0"), // 上调两个等级的颜色，深灰色
//   "1": new Color("3B72E6"), // 上调两个等级的颜色
//   "2": new Color("3B72E6"), // 上调两个等级的颜色
//   "3": new Color("3B72E6"), // 上调两个等级的颜色
//   "4": new Color("2CDC81"), // 上调两个等级的颜色
//   "5": new Color("2CDC81"), // 上调两个等级的颜色
//   "6": new Color("2CDC81"), // 上调两个等级的颜色
//   "6X": new Color("2CDC81"), // 上调两个等级的颜色
//   "7": new Color("E465E5"), // 上调两个等级的颜色
//   "7X": new Color("E465E5"), // 上调两个等级的颜色
//   "J": new Color("CAA978"), // 上调两个等级的颜色，棕色
//   "Z": new Color("CAA978"), // 上调两个等级的颜色，棕色
//   "SI": new Color("4F85F1"), // 上调两个等级的颜色，天蓝色
//   "G": new Color("A6FBA9") // 上调两个等级的颜色，亮绿色
// };


// // 定义线路颜色映射：原始官方色彩，有点古老，在屏幕上但不好看。
// const routeColors = {
//   "A": new Color("1C34A4"),
//   "C": new Color("1C34A4"),
//   "E": new Color("1C34A4"),
//   "B": new Color("FD7023"), // 橙色
//   "D": new Color("FD7023"), // 橙色
//   "F": new Color("FD7023"), // 橙色
//   "FX": new Color("FD7023"), // 橙色
//   "M": new Color("FD7023"), // 橙色
//   "N": new Color("fccc0a"),
//   "Q": new Color("fccc0a"),
//   "R": new Color("fccc0a"),
//   "W": new Color("fccc0a"),
//   "S": new Color("808183"),
//   "FS": new Color("808183"), // 银色，有可能不是这个，有可能是SF
//   "H": new Color("808183"), // 银色，SR的代号
//   "L": new Color("a7a9ac"), // 深灰色
//   "1": new Color("ee352e"),
//   "2": new Color("ee352e"),
//   "3": new Color("ee352e"),
//   "4": new Color("00933c"),
//   "5": new Color("00933c"),
//   "6": new Color("00933c"),
//   "6X": new Color("00933c"),
//   "7": new Color("b933ad"),
//   "7X": new Color("b933ad"),
//   "J": new Color("996633"),// 棕色
//   "Z": new Color("996633"), // 棕色
//   // "SI": Color.cyan(), // 天蓝色
//   "SI": Color.blue(),
//   "G": new Color("6cbe45") // 亮绿色
// };

// 定义线路颜色映射：原始官方色彩，微调修改了部分色彩
const routeColors = {
  "A": Color.blue(),
  "C": Color.blue(),
  "E": Color.blue(),
  "B": new Color("FD7023"), // 橙色
  "D": new Color("FD7023"), // 橙色
  "F": new Color("FD7023"), // 橙色
  "FX": new Color("FD7023"), // 橙色
  "M": new Color("FD7023"), // 橙色
  "N": new Color("fccc0a"),
  "Q": new Color("fccc0a"),
  "R": new Color("fccc0a"),
  "W": new Color("fccc0a"),
  "S": new Color("808183"),
  "FS": new Color("808183"), // 银色，有可能不是这个，有可能是SF
  "H": new Color("808183"), // 银色，SR的代号
  "L": new Color("a7a9ac"), // 深灰色
  "1": new Color("ee352e"),
  "2": new Color("ee352e"),
  "3": new Color("ee352e"),
  "4": new Color("00933c"),
  "5": new Color("00933c"),
  "6": new Color("00933c"),
  "6X": new Color("00933c"),
  "7": new Color("b933ad"),
  "7X": new Color("b933ad"),
  "J": new Color("996633"),// 棕色
  "Z": new Color("996633"), // 棕色
  // "SI": Color.cyan(), // 天蓝色
  "SI": Color.blue(),
  "G": new Color("6cbe45") // 亮绿色
};


// // 定义线路颜色映射：安全色系列
// const routeColors = {
//   "A": Color.blue(),
//   "C": Color.blue(),
//   "E": Color.blue(),
//   "B": Color.orange(), // 橙色
//   "D": Color.orange(), // 橙色
//   "F": Color.orange(), // 橙色
//   "FX": Color.orange(), // 橙色
//   "M": Color.orange(), // 橙色
//   "N": Color.yellow(),
//   "Q": Color.yellow(),
//   "R": Color.yellow(),
//   "W": Color.yellow(),
//   "S": Color.gray(), // 银色
//   "FS": Color.gray(), // 银色，有可能不是这个，有可能是SF
//   "H": Color.gray(), // 银色，SR的代号
//   "L": Color.darkGray(), // 深灰色
//   "1": Color.red(),
//   "2": Color.red(),
//   "3": Color.red(),
//   "4": Color.green(),
//   "5": Color.green(),
//   "6": Color.green(),
//   "6X": Color.green(),
//   "7": Color.purple(),
//   "7X": Color.purple(),
//   "J": Color.brown(), // 棕色
//   "Z": Color.brown(), // 棕色
//   "SI": Color.blue(), // 天蓝色
//   "G": Color.green() // 亮绿色
// };


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
if(widgetSize!="extraLarge"){
  const titleText = widget.addText(`${stationName}`);
  titleText.textColor = Color.white();
  titleText.centerAlignText();
  if (widgetSize === "small") {
    titleText.font = Font.boldSystemFont(14);
  }else if(widgetSize==="medium"){
    titleText.font = Font.boldSystemFont(20);
  }else{
    titleText.font = Font.boldSystemFont(30);
  }
  // if(widgetSize!="medium"){
  //   widget.addSpacer()
  // }
 
}

widget.addSpacer(5)




if(widgetSize==="large"){
  //以下内容复制来自extralarge的部分并微调，暂未合并为单独模块调用，后面有时间再搞
  const routeStack = widget.addStack()
  routeStack.addSpacer()
  
  
  // // 遍历并依次显示路线，并设置颜色
  // routes.forEach(function(route) {
  //   var text = routeStack.addText(route);
  //   text.textColor = routeColors[route];
  // });

  // 遍历并依次显示路线，并设置颜色和背景圆形
  routes.forEach(function(route) {
    var routeText = route === "H" ? "SR" : route === "FS" ? "SF" : route === "SI" ? "SIR" : route;
    
    var circle = routeStack.addStack();
    
    // circle.layoutHorizontally();
    // circle.addSpacer();
    circle.backgroundColor = routeColors[route];
    circle.cornerRadius = 15;
    circle.size = new Size(30, 30);

    // 加了边框不好看，取消了。
    // circle.borderWidth = 3; // 边框宽度为2个单位
    // circle.borderColor = new Color("#FFFFFF"); // 边框颜色为白色
    

    if (routeText.length === 2) {

      //想把X做小显示，但是不好看算了。
      // var text = circle.addText(routeText.charAt(0));
      // text.textColor = Color.white();
      // text.font = Font.boldSystemFont(25);
      // text.centerAlignText()
      
      // var secondChar = circle.addText(routeText.charAt(1));
      // secondChar.font = Font.boldSystemFont(15); // 使用5号字体
      // secondChar.centerAlignText()
      
      circle.layoutHorizontally();
      circle.addSpacer(1)
      
      const circleInside = circle.addStack()
      circleInside.layoutVertically();
      circleInside.addSpacer(3)
      var text = circleInside.addText(routeText);
      text.textColor = route === "N" || route === "Q" || route === "R" || route === "W" ? Color.black() : Color.white();
      // text.font = Font.thinSystemFont(20);
      text.font = Font.boldSystemFont(20);
      text.centerAlignText()
      circleInside.addSpacer(1)
      circle.addSpacer(1)

    }else if (routeText.length===3){
      circle.layoutHorizontally();
      circle.centerAlignContent();
      // circle.addSpacer(1)
      
      const circleInside = circle.addStack()
      circleInside.layoutVertically();
      circleInside.centerAlignContent
      // circleInside.addSpacer(1)
      var text = circleInside.addText(routeText);
      text.textColor = route === "N" || route === "Q" || route === "R" || route === "W" ? Color.black() : Color.white();
      // text.font = Font.thinSystemFont(20);
      text.font = Font.boldSystemFont(16);
      text.centerAlignText()
      // circleInside.addSpacer(1)
      // circle.addSpacer(1)
    } else {
      var text = circle.addText(routeText);
      text.textColor = route === "N" || route === "Q" || route === "R" || route === "W" ? Color.black() : Color.white();
      text.font = Font.boldSystemFont(25);
      text.centerAlignText();
      text.lineLimit = 5;

      // circle.addSpacer();
      
      // circle.addText(" "); // 空文本用于占位
      // circle.setPadding(0,10,0,10)
      // routeStack.addSpacer()

      
    }
    var circleGap = routeStack.addStack();
      circleGap.size = new Size(5, 30);


    
  });




  routeStack.addSpacer()

  widget.addSpacer(8)
}









const myStack = widget.addStack();
myStack.layoutHorizontally();

if(widgetSize==="small"){
  myStack.setPadding(0,5,0,5);
}else if (widgetSize==="extraLarge"){
  myStack.setPadding(10,25,10,25)
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
}else if(widgetSize==="large"){
  displayNumber=8
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
    trainTextItem.font = Font.regularMonospacedSystemFont(10);
  }else if(widgetSize==="medium"){
    trainTextItem.font = Font.regularMonospacedSystemFont(16);
  }else if(widgetSize==="large"){
    trainTextItem.font = Font.regularMonospacedSystemFont(20);
  }else{
    trainTextItem.font = Font.regularMonospacedSystemFont(22);

  }
});


if(widgetSize==="extraLarge"){
  myStack.addSpacer()

  const middleStack = myStack.addStack();
  // middleStack.centerAlignContent();
  middleStack.layoutVertically();
  middleStack.centerAlignContent()

  middleStack.addSpacer()

  //因为软件限制，如果要在stack中居中一个文本，需要再加一个stack，然后塞两个spacer在两头
  const nameStack = middleStack.addStack();
  nameStack.addSpacer()
  //scriptable
  titleText = nameStack.addText(`${stationName}`);
  titleText.textColor = Color.white();
  titleText.centerAlignText();
  titleText.font = Font.boldSystemFont(36);
  nameStack.addSpacer()

  middleStack.addSpacer(8)





  const routeStack = middleStack.addStack()
  routeStack.addSpacer()
  
  
  // // 遍历并依次显示路线，并设置颜色
  // routes.forEach(function(route) {
  //   var text = routeStack.addText(route);
  //   text.textColor = routeColors[route];
  // });

  // 遍历并依次显示路线，并设置颜色和背景圆形
  routes.forEach(function(route) {
    var routeText = route === "H" ? "SR" : route === "FS" ? "SF" : route === "SI" ? "SIR" : route;
    
    var circle = routeStack.addStack();
    
    // circle.layoutHorizontally();
    // circle.addSpacer();
    circle.backgroundColor = routeColors[route];
    circle.cornerRadius = 15;
    circle.size = new Size(30, 30);

    // 加了边框不好看，取消了。
    // circle.borderWidth = 3; // 边框宽度为2个单位
    // circle.borderColor = new Color("#FFFFFF"); // 边框颜色为白色
    

    if (routeText.length === 2) {

      //想把X做小显示，但是不好看算了。
      // var text = circle.addText(routeText.charAt(0));
      // text.textColor = Color.white();
      // text.font = Font.boldSystemFont(25);
      // text.centerAlignText()
      
      // var secondChar = circle.addText(routeText.charAt(1));
      // secondChar.font = Font.boldSystemFont(15); // 使用5号字体
      // secondChar.centerAlignText()
      
      circle.layoutHorizontally();
      circle.addSpacer(1)
      
      const circleInside = circle.addStack()
      circleInside.layoutVertically();
      circleInside.addSpacer(3)
      var text = circleInside.addText(routeText);
      text.textColor = route === "N" || route === "Q" || route === "R" || route === "W" ? Color.black() : Color.white();
      // text.font = Font.thinSystemFont(20);
      text.font = Font.boldSystemFont(20);
      text.centerAlignText()
      circleInside.addSpacer(1)
      circle.addSpacer(1)

    }else if (routeText.length===3){
      circle.layoutHorizontally();
      circle.centerAlignContent();
      // circle.addSpacer(1)
      
      const circleInside = circle.addStack()
      circleInside.layoutVertically();
      circleInside.centerAlignContent
      // circleInside.addSpacer(1)
      var text = circleInside.addText(routeText);
      text.textColor = route === "N" || route === "Q" || route === "R" || route === "W" ? Color.black() : Color.white();
      // text.font = Font.thinSystemFont(20);
      text.font = Font.boldSystemFont(16);
      text.centerAlignText()
      // circleInside.addSpacer(1)
      // circle.addSpacer(1)
    } else {
      var text = circle.addText(routeText);
      text.textColor = route === "N" || route === "Q" || route === "R" || route === "W" ? Color.black() : Color.white();
      text.font = Font.boldSystemFont(25);
      text.centerAlignText();
      text.lineLimit = 5;

      // circle.addSpacer();
      
      // circle.addText(" "); // 空文本用于占位
      // circle.setPadding(0,10,0,10)
      // routeStack.addSpacer()

      
    }
    var circleGap = routeStack.addStack();
      circleGap.size = new Size(5, 30);


    
  });




  routeStack.addSpacer()
  
  middleStack.addSpacer(12)


  const strStack = middleStack.addStack();
  strStack.addSpacer()

  if (systemLanguage.startsWith("zh")) {
    str = strStack.addText("距上次更新过去了")
  } else {
    str = strStack.addText("Last Update")
  }
  
  str.textColor = Color.gray();
  str.font = Font.footnote();
  // str.centerAlignText();
  strStack.addSpacer()

  
  const d = middleStack.addDate(now)
  d.applyRelativeStyle();
  d.textColor = Color.gray();
  d.font = Font.footnote();
  d.centerAlignText();
  middleStack.addSpacer()
}




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
    trainTextItem.font = Font.regularMonospacedSystemFont(10);
  }else if(widgetSize==="medium"){
    trainTextItem.font = Font.regularMonospacedSystemFont(16);
  }else if(widgetSize==="large"){
    trainTextItem.font = Font.regularMonospacedSystemFont(20);
  }else{
    trainTextItem.font = Font.regularMonospacedSystemFont(22);

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

}else if (widgetSize==="extraLarge"){

}else{

  
  const d = widget.addDate(now)
  d.applyRelativeStyle();
  d.textColor = Color.gray();
  d.font = Font.footnote();
  d.centerAlignText();

 



  // const bottomStack = widget.addStack()
  // bottomStack.addSpacer()
  // bottomStack.layoutHorizontally()
  // const bleft = bottomStack.addStack()
  


  // bleft.addSpacer()
  // str = bleft.addText("距上一次更新过去了")
  // str.textColor = Color.gray();
  // str.font = Font.footnote();
  // // str.centerAlignText();

  
  // const bright = bottomStack.addStack()
  // const d = bright.addDate(now)
  // d.applyRelativeStyle();
  // d.textColor = Color.gray();
  // d.font = Font.footnote();
  // // d.centerAlignText();

  // bottomStack.addSpacer()

}











widget.addSpacer()


//发现渐变背景不好看，废弃
// let gradient = new LinearGradient()
//   gradient.locations = [0, 1]
//   gradient.colors = [
//     new Color("242424"),
//     new Color("484848")
//   ]
// widget.backgroundGradient = gradient




widget.backgroundColor = new Color("242424");
const padding = 10;
widget.setPadding(padding, padding, padding, padding);




//尝试更快刷新，但是最终决定权还是在系统，通常在1m~1h之间不等
let nextRefresh = Date.now() + 1000*30 // add 30 second to now
widget.refreshAfterDate = new Date(nextRefresh)




// 显示小组件
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  
  if(Device.isPhone()){
    // widget.presentSmall();
    // widget.presentMedium();
      widget.presentLarge();

  }else{
    // widget.presentSmall();
    // widget.presentMedium();
    // widget.presentLarge();
    widget.presentExtraLarge();
  }
  
}

Script.complete();
