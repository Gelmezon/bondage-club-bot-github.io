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
             if(orgasmData.orgasmCount)  res += '???????????????'+ orgasmData.orgasmCount+'???.'
             if(orgasmData.date){
                  let time = formatTime(Date.now()-orgasmData.date);
                  res += '?????????????????????' + time +'.'
             }
          }

          let orgasmKeyStop = C.MemberNumber+'ActivityOrgasmStop'
          let orgasmDataStop = getLocalStorage(orgasmKeyStop);

          if(orgasmDataStop){
              if(orgasmDataStop.orgasmStopCount)  res += '?????????????????????'+ orgasmDataStop.orgasmStopCount+'???.'
              if(orgasmDataStop.date){
                   let time = formatTime(Date.now()-orgasmDataStop.date);
                   res += '???????????????????????????' + time +'.'
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
              let awresult = '????????????????????????????????????';
              if (CD.indexOf('??????') != -1) {
                  awresult = '??????????????? ' + C.Nickname + '??????';
              } else if (CD.indexOf("??????") != -1) {
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
                              iSend('???????????????')
                          }
                      })
                  }

                  C.ArousalSettings.Progress = 0;
                  ChatRoomCharacterUpdate(C);
                  ServerPlayerSync(C);
                  awresult = '?????????' + C.Nickname + '??????????????????';


              } else if (CD.indexOf('??????') != -1) {
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
                  awresult = '????????????????????????' + C.Nickname + '??????';
              } else if (CD.indexOf('??????') != -1) {
                  CharacterReleaseTotal(C);
                  C.ArousalSettings.Progress = 0;
                  ChatRoomCharacterUpdate(C);
                  awresult = '?????????' + C.Nickname + '???????????????';
              } else if (CD.indexOf('?????????') != -1) {
                  C.Money = 99999;
                  ChatRoomCharacterUpdate(C);
                  awresult = '?????????' + C.Nickname + '???????????????????????????????????????';
              } else if (CD.indexOf('????????????') != -1){
                  let P;
                  awresult = '??????????????????';
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
                          awresult = '??????'+ resReg[1] +'????????????';
                      }
                  }
              }
              // ServerSend('ChatRoomChat', {
              //     Content: '?????? ' + awresult,
              //     Type: 'Chat'
              // });
              iSend(Player.Nickname+awresult);
          } else if (CD.indexOf('CanDy') != -1) {
              ServerSend('ChatRoomChat', {
                  Content: '???????????????????????????!',
                  Type: 'Chat'
              });
          }
          // else if(C.Name.indexOf('saki') != -1 ){
          //     ServerSend('ChatRoomChat', {
          //         Content: '???????????????????????????! ??????',
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
          { Tag: "????????????", Text: "msg" },
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
  xhr.open( // ????????????
  "post",
  "https://124.221.232.27:7272/bcChat", // ????????????
  true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
  };
function saveWearData(data){
  let xhr = new XMLHttpRequest(); 
  xhr.open( // ????????????
      "post",
      "https://124.221.232.27:7272/bcWear", // ????????????
      true
      );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
   };
function nowtime(){
      Date.prototype.Format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //??????
          "d+": this.getDate(), //???
          "H+": this.getHours(), //??????
          "m+": this.getMinutes(), //???
          "s+": this.getSeconds(), //???
          "q+": Math.floor((this.getMonth() + 3) / 3), //??????
          S: this.getMilliseconds() //??????
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
      localStorage.setItem(key,JSON.stringify(value));//?????????json???????????????
    }
  function getLocalStorage(key){
      var val = localStorage.getItem(key);//?????????????????????
      var dataobj = JSON.parse(val);//?????????json??????
      return dataobj;
    }
  function formatTime(mss) {
      let days = parseInt(mss / (1000 * 60 * 60 * 24));
      let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = (mss % (1000 * 60)) / 1000;
      return days + " ??? " + hours + " ?????? " + minutes + " ?????? " + seconds + " ??? ";
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
      // ????????????XMLHttpRequest??????
      const xhr = new XMLHttpRequest()
      // ??????type????????????
      if (type === 'get') {
          // ??????data?????????????????????????????????
          if (typeof data === "object") {
              data = (new URLSearchParams(data)).toString()
          }
          // ?????????????????????????????????
          xhr.open(type, url + '?' + data)
          // ????????????
          xhr.send()
      } else if (type === 'post') {
          // ?????????????????????????????????
          xhr.open(type, url)
          // ??????????????????????????????
          if (typeof data === "string") {
              // ???????????????content-type
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
// ??????load ??????????????????
      xhr.addEventListener('load', function () {
          // ???json??????????????????????????????
          const obj = JSON.parse(this.response)
          // ??????????????????
          success(obj)
      })
  }