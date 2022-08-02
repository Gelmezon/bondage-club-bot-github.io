// ==UserScript==
// @name CandyBot
// @description CandyBot
// @version 1.05r
// @namespace love_kokia
// @match *://*/*BondageClub*
// @grant GM_registerMenuCommand
// ==/UserScript==
(function () {
  const  nameRegExp =new RegExp("#(.*)#");
  ActivityOrgasmStart = (C)=>{
      if ((C.ID == 0) || C.IsNpc()) {
          if (C.ID == 0 && !ActivityOrgasmRuined) ActivityOrgasmGameResistCount = 0;
          AsylumGGTSTOrgasm(C);
          ActivityOrgasmWillpowerProgress(C);
          if (!ActivityOrgasmRuined) {
              C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
              C.ArousalSettings.OrgasmStage = 2;
              C.ArousalSettings.OrgasmCount = (C.ArousalSettings.OrgasmCount == null) ? 1 : C.ArousalSettings.OrgasmCount + 1;
              ActivityOrgasmGameTimer = C.ArousalSettings.OrgasmTimer - CurrentTime;
              if ((C.ID == 0) && (CurrentScreen == "ChatRoom")) {
                  let Dictionary = [];
                  Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
                  ServerSend("ChatRoomChat", { Content: "Orgasm" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary });
                  ActivityChatRoomArousalSync(C);
                  let orgasmKey = C.MemberNumber+'ActivityOrgasm'
                  let orgasmData = getLocalStorage(orgasmKey);
                  if(!orgasmData){
                      orgasmData = {}
                      orgasmData.orgasmCount = 0;
                  }
                  if(!orgasmData.orgasmCount){
                      orgasmData.orgasmCount = 0;
                  }
                  orgasmData.orgasmCount = orgasmData.orgasmCount + 1;
                  orgasmData.date = Date.now();
                  setLocalStorage(orgasmKey,orgasmData);
              }
          } else {
              ActivityOrgasmStop(Player, 65 + Math.ceil(Math.random() * 20));
              if ((C.ID == 0) && (CurrentScreen == "ChatRoom")) {
                  let Dictionary = [];
                  let ChatModifier = C.ArousalSettings.OrgasmStage == 1 ? "Timeout" : "Surrender";
                  Dictionary.push({ Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber });
                  ServerSend("ChatRoomChat", { Content: ("OrgasmFail" + ChatModifier + (Math.floor(Math.random() * 3))).toString(), Type: "Activity", Dictionary: Dictionary });
                  ActivityChatRoomArousalSync(C);
                  let orgasmKeyStop = C.MemberNumber+'ActivityOrgasmStop'
                  let orgasmDataStop = getLocalStorage(orgasmKeyStop);
                  if(!orgasmDataStop){
                      orgasmDataStop = {}
                      orgasmDataStop.orgasmStopCount = 0;
                  }
                  if(!orgasmDataStop.orgasmStopCount){
                      orgasmDataStop.orgasmStopCount = 0;
                  }  
                  orgasmDataStop.orgasmStopCount = orgasmDataStop.orgasmStopCount + 1;
                  orgasmDataStop.date = Date.now();
                  setLocalStorage(orgasmKeyStop,orgasmDataStop);
              }
          }

          let res = '';

          let orgasmKey = C.MemberNumber+'ActivityOrgasm'
          let orgasmData = getLocalStorage(orgasmKey);
          if(orgasmData){
             if(orgasmData.orgasmCount)  res += '已经高潮了'+ orgasmData.orgasmCount+'次.'
             if(orgasmData.date){
                  let time = formatTime(Date.now()-orgasmData.date);
                  res += '上次高潮距现在' + time +'.'
             }
          }

          let orgasmKeyStop = C.MemberNumber+'ActivityOrgasmStop'
          let orgasmDataStop = getLocalStorage(orgasmKeyStop);

          if(orgasmDataStop){
              if(orgasmDataStop.orgasmStopCount)  res += '已经毁灭高潮了'+ orgasmDataStop.orgasmStopCount+'次.'
              if(orgasmDataStop.date){
                   let time = formatTime(Date.now()-orgasmDataStop.date);
                   res += '上次毁灭高潮距现在' + time +'.'
              }
          }
          if(res != ''){
              iSend(Player.Nickname +' '+ res)
          }
      }
  }

let  InventoryWearNew =(C, AssetName, AssetGroup, ItemColor, Difficulty, MemberNumber, Craft,Property)=> {
	const A = AssetGet(C.AssetFamily, AssetGroup, AssetName);
	if (!A) return;
	CharacterAppearanceSetItem(C, AssetGroup, A, ((ItemColor == null || ItemColor == "Default") && A.DefaultColor != null) ? A.DefaultColor : ItemColor, Difficulty, MemberNumber, false);
	CharacterRefresh(C, true);
	let Item = InventoryGet(C, AssetGroup);
	if (Craft != null) Item.Craft = Craft;
    if (Craft != null) Item.Property = Property;
	InventoryExpressionTrigger(C, Item);
}
  /***
   * magicSay
   */
  for (const command of Commands) {
      if(command.Tag == 'kokiasay'){
          return;
      }
  }
      Commands.push( {
        Tag: 'kokiasay',
        Action: args => {
          iSend(args)
        }
      })
  GM_registerMenuCommand('candyBot', () => {
      var messageLast = '';
      SpeechGarble = function (C, CD, NoDeaf) {
      if(!NoDeaf){
          //Process the command only when it is sent first.
          if ((CD.indexOf('candy') != -1) && (CD.indexOf('candyBot') == -1)) {
              let awresult = '欢迎使用堪蒂的神秘小道具';
              if (CD.indexOf('亲我') != -1) {
                  awresult = '轻轻的亲了 ' + C.Nickname + '一下';
              } else if (CD.indexOf("束缚") != -1) {
                  let resReg = nameRegExp.exec(CD);
                  if(resReg && resReg.length > 1){
                      let savaData = {}
                      savaData.wearName = resReg[1];
                      ajax('bcWear','get',{wearName:resReg[1]},(res)=>{
                          if(res){
                              let wearData = res[0].wearData;
                              wearData.forEach(x=>{
                                  colorArray = []
                                  for(let c of x.Color){
                                      colorArray.push(c.toString())
                                  }
                                  InventoryWearNew(C, x.Name, x.ArousalZone, colorArray, '10', C.MemberNumber,C.Craft,C.Property)
                              })
                              iSend('束缚好了哦')
                          }
                      })
                  }

                  C.ArousalSettings.Progress = 0;
                  ChatRoomCharacterUpdate(C);
                  ServerPlayerSync(C);
                  awresult = '已经为' + C.Nickname + '酱捆绑好了哦';


              } else if (CD.indexOf('锁我') != -1) {
                  C.Appearance.forEach(item => {
                      let i = 0;
                      if (item.Difficulty > 0) {
                          if (item.Property == null) {
                              item.Property = {};
                          }
                          if (item.Property.Effect == null) {
                              item.Property.Effect = [];
                          }
                          if (item.Property.Effect.indexOf('Lock') < 0) {
                              item.Property.Effect.push('Lock')
                          }
                          item.Property.LockedBy = 'MistressPadlock';
                          item.Property.LockMemberNumber = Player.MemberNumber;
                          C.Appearance[i] = item;
                      }
                      i++;
                  }
                  );
                  C.ArousalSettings.Progress = 0;
                  ChatRoomCharacterUpdate(C);
                  awresult = '已经牢牢的锁住了' + C.Nickname + '酱哦';
              } else if (CD.indexOf('解开') != -1) {
                  CharacterReleaseTotal(C);
                  C.ArousalSettings.Progress = 0;
                  ChatRoomCharacterUpdate(C);
                  awresult = '已经为' + C.Nickname + '酱解开了哦';
              } else if (CD.indexOf('给我钱') != -1) {
                  C.Money = 99999;
                  ChatRoomCharacterUpdate(C);
                  awresult = '已经在' + C.Nickname + '酱的裤子里放了满满的金币哦';
              } else if (CD.indexOf('保存束缚') != -1){
                  let P;
                  awresult = '束缚保存失败';
                  for(let i of Character){
                      if(i.MemberNumber == C.MemberNumber ){
                          P = i
                      }
                  }
                  let resReg = nameRegExp.exec(CD);
                  if(resReg && resReg.length > 1){
                      if(P){
                          let wearData = getWearData(P)
                          let savaData = {}
                          savaData.updateMemberNumber =  C.MemberNumber;
                          savaData.updateMemberNickName = C.Nickname;
                          savaData.wearData = wearData;
                          savaData.wearName = resReg[1];
                          saveWearData(savaData);
                          awresult = '束缚'+ resReg[1] +'保存成功';
                      }
                  }
              }
              // ServerSend('ChatRoomChat', {
              //     Content: '堪蒂 ' + awresult,
              //     Type: 'Chat'
              // });
              iSend(Player.Nickname+awresult);
          } else if (CD.indexOf('CanDy') != -1) {
              ServerSend('ChatRoomChat', {
                  Content: '堪蒂机器人运行正常!',
                  Type: 'Chat'
              });
          }
          // else if(C.Name.indexOf('saki') != -1 ){
          //     ServerSend('ChatRoomChat', {
          //         Content: '乖兔叽训练系统启动! 喵喵',
          //         Type: 'Chat'
          //     });
          // }
      //Process the gag in my way.
      if(messageLast != C.MemberNumber+CD && CD.slice(0,1) != "("){
          let messageDate = {    
              "senderMemberNumber": C.MemberNumber+'',
              "roomName": ChatRoomData.Name,
              "sendMessage": CD,
              "nickName": C.Nickname,
              "sendDate": nowtime(),
              "senderCode": Player.MemberNumber+''
          }
          messageLast = C.MemberNumber+CD
          saveMessage(messageDate)
      }
      }
      let NS = CD;
      let GagEffect = SpeechGetTotalGagLevel(C, NoDeaf);
      if (GagEffect > 0) {
          NS = 'GAG lv' + GagEffect + ' ' + NS;
      }
      return NS;
      }

  }
  );
  GM_registerMenuCommand('spankBot', () => {
      var memberJoin = ChatRoomSyncMemberJoin
      ChatRoomSyncMemberJoin = (data) => {
          memberJoin.apply(this, data)
          setTimeout(() => {
              ServerSend("ChatRoomChat", { Content: "ChatOther-ItemButt-Spank", Type: "Activity", Dictionary: [
                  { Tag: "SourceCharacter", Text: CharacterNickname(Player), MemberNumber: Player.MemberNumber },
                  { Tag: "TargetCharacter", Text: CharacterNickname(data.Character), MemberNumber: data.SourceMemberNumber },
              ] });
          }, 1500);
      }
  });

  })();


var messageInfo = "";
const baseUrl = 'https://124.221.232.27:7272/'
const  bodyType = ['Height','BodyUpper','BodyLower','HairFront','HairBack']
function iSend(text){
  if(text == messageInfo){
      return
  }
  messageInfo = text;
  ServerSend("ChatRoomChat", {
      Content: "Beep",
      Type: "Action",
      Dictionary: [
          // EN
          { Tag: "Beep", Text: "msg" },
          // CN
          { Tag: "发送私聊", Text: "msg" },
          // DE
          { Tag: "Biep", Text: "msg" },
          // FR
          { Tag: "Sonner", Text: "msg" },
          // Message itself
          { Tag: "msg", Text: text },
      ],
})};

function saveMessage(data){
  let xhr = new XMLHttpRequest(); 
  xhr.open( // 打开链接
  "post",
  "https://124.221.232.27:7272/bcChat", // 后端地址
  true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
  };
function saveWearData(data){
  let xhr = new XMLHttpRequest(); 
  xhr.open( // 打开链接
      "post",
      "https://124.221.232.27:7272/bcWear", // 后端地址
      true
      );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
   };
function nowtime(){
      Date.prototype.Format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "H+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
 
      var a = new Date().Format("yyyy-MM-dd HH:mm:ss");
 
      return (this.nowtime = a);
    }

  function setLocalStorage(key,value){
      localStorage.setItem(key,JSON.stringify(value));//转换成json字符串序列
    }
  function getLocalStorage(key){
      var val = localStorage.getItem(key);//获取存储的元素
      var dataobj = JSON.parse(val);//解析出json对象
      return dataobj;
    }
  function formatTime(mss) {
      let days = parseInt(mss / (1000 * 60 * 60 * 24));
      let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = (mss % (1000 * 60)) / 1000;
      return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
    }
  function getWearData(Player) {
      let wearArray = []
      Player.Appearance.forEach((x) => {
          let res = bodyType.indexOf(x.Asset.ArousalZone);
          if(res == -1){
              wearData = {};
              wearData.ArousalZone = x.Asset.ArousalZone
              wearData.Name = x.Asset.Name
              wearData.Color = x.Color 
              if(x.Craft){
                  wearData.Craft = x.Craft;
              }
              if(x.Property){
                  wearData.Property = x.Property;
              }
              wearArray.push(wearData)  
          }
      })
      return wearArray;
  } 
  function ajax ( method, type, data = '', success ) {
      let url = baseUrl + method
      // 创建一个XMLHttpRequest对象
      const xhr = new XMLHttpRequest()
      // 判断type请求方式
      if (type === 'get') {
          // 判断data的数据类型转换成字符串
          if (typeof data === "object") {
              data = (new URLSearchParams(data)).toString()
          }
          // 设置请求方式和请求地址
          xhr.open(type, url + '?' + data)
          // 发送请求
          xhr.send()
      } else if (type === 'post') {
          // 设置请求方式和请求地址
          xhr.open(type, url)
          // 判断数据是不是字符串
          if (typeof data === "string") {
              // 设置对应的content-type
              xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
              xhr.send(data)
          } else if (typeof data === "object") {
              if (data instanceof FormData) {
                  xhr.send(data)
              } else {
                  xhr.setRequestHeader('Content-type', 'application/json')
                  const str = JSON.stringify(data);
                  console.log(typeof str)
                  xhr.send(str)
              }
          }
      }
// 监听load 获取响应结果
      xhr.addEventListener('load', function () {
          // 把json格式的数据转换成对象
          const obj = JSON.parse(this.response)
          // 就是返回结果
          success(obj)
      })
  }