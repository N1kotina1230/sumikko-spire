export type CardId = 'strike'|'guard'|'tail'|'curl'|'snack'|'tea'|'brave'|'crumbs'|'tempura'|'hug'|'dash'|'picnic'|'whirl'|'warm'|'batter'|'golden';
export type Card = { id: CardId; uid: number; upgraded?: boolean };
export type CardDef = { name: string; cost: number; type: '攻击'|'技能'|'能力'; rarity: '基础'|'普通'|'罕见'|'稀有'; art: string; text: string; damage?: number; hits?: number; block?: number; heal?: number; draw?: number; strength?: number; poison?: number; vulnerable?: number; energy?: number; all?: boolean; exhaust?: boolean };
export const CARDS: Record<CardId, CardDef> = {
  strike:{name:'小小一击',cost:1,type:'攻击',rarity:'基础',art:'strike',text:'造成 6 点伤害。',damage:6},
  guard:{name:'躲进角落',cost:1,type:'技能',rarity:'基础',art:'guard',text:'获得 5 点格挡。',block:5},
  tail:{name:'尾巴连击',cost:1,type:'攻击',rarity:'普通',art:'tail',text:'造成 4 点伤害，共 2 次。',damage:4,hits:2},
  curl:{name:'裹紧被被',cost:2,type:'技能',rarity:'普通',art:'curl',text:'获得 14 点格挡。',block:14},
  snack:{name:'午后点心',cost:1,type:'技能',rarity:'罕见',art:'snack',text:'恢复 5 点生命。消耗。',heal:5,exhaust:true},
  tea:{name:'热茶时间',cost:0,type:'技能',rarity:'普通',art:'tea',text:'抽 2 张牌。',draw:2},
  brave:{name:'小小勇气',cost:1,type:'能力',rarity:'罕见',art:'brave',text:'本场战斗获得 2 点勇气。消耗。',strength:2,exhaust:true},
  crumbs:{name:'发霉面包屑',cost:1,type:'技能',rarity:'普通',art:'crumbs',text:'给予敌人 5 层发霉。',poison:5},
  tempura:{name:'酥脆冲撞',cost:2,type:'攻击',rarity:'罕见',art:'tempura',text:'造成 15 点伤害。给予 2 回合受潮。',damage:15,vulnerable:2},
  hug:{name:'暖暖拥抱',cost:1,type:'技能',rarity:'普通',art:'hug',text:'获得 6 点格挡。抽 1 张牌。',block:6,draw:1},
  dash:{name:'偷偷溜过',cost:0,type:'攻击',rarity:'普通',art:'dash',text:'造成 3 点伤害。抽 1 张牌。',damage:3,draw:1},
  picnic:{name:'角落野餐',cost:2,type:'技能',rarity:'罕见',art:'picnic',text:'获得 10 点格挡。恢复 3 点生命。消耗。',block:10,heal:3,exhaust:true},
  whirl:{name:'酥酥旋风',cost:1,type:'攻击',rarity:'罕见',art:'whirl',text:'对所有敌人造成 8 点伤害。',damage:8,all:true},
  warm:{name:'元气满满',cost:0,type:'技能',rarity:'稀有',art:'warm',text:'获得 2 点能量。消耗。',energy:2,exhaust:true},
  batter:{name:'酥脆外衣',cost:1,type:'能力',rarity:'罕见',art:'batter',text:'获得 5 点格挡和 1 点勇气。消耗。',block:5,strength:1,exhaust:true},
  golden:{name:'金色的心意',cost:2,type:'攻击',rarity:'稀有',art:'golden',text:'造成 12 点伤害。获得 10 点格挡。',damage:12,block:10},
};
export function cardDef(c: Card): CardDef {
  const d = {...CARDS[c.id]};
  if (!c.upgraded) return d;
  d.name += '+';
  if(d.damage) d.damage += 3;
  if(d.block) d.block += 3;
  if(d.heal) d.heal += 2;
  if(d.draw) d.draw += 1;
  if(d.poison) d.poison += 3;
  if(d.strength) d.strength += 1;
  if(d.energy) d.energy += 1;
  d.text = [d.damage?`${d.all?'对所有敌人':''}造成 ${d.damage} 点伤害${d.hits?'，共 2 次':''}。`:'',d.block?`获得 ${d.block} 点格挡。`:'',d.heal?`恢复 ${d.heal} 点生命。`:'',d.draw?`抽 ${d.draw} 张牌。`:'',d.poison?`给予 ${d.poison} 层发霉。`:'',d.strength?`本场获得 ${d.strength} 点勇气。`:'',d.energy?`获得 ${d.energy} 点能量。`:'',d.vulnerable?`给予 2 回合受潮。`:'',d.exhaust?'消耗。':''].join('');
  return d;
}
export type NodeType = 'battle'|'elite'|'event'|'rest'|'shop'|'boss';
export type MapNode = {id: string; floor: number; col: number; kind: NodeType};
export type Intent = { type:'attack'|'defend'|'grow'; value:number; label:string };
export type Enemy = { uid:number; name:string; art:string; hp:number; maxHp:number; block:number; poison:number; vulnerable:number; strength:number; intents:Intent[]; step:number };
export type Game = {
 version:1; phase:'combat'|'reward'|'map'|'event'|'rest'|'shop'|'victory'|'defeat';
 hp:number; maxHp:number; gold:number; energy:number; block:number; strength:number;
 deck:Card[]; hand:Card[]; draw:Card[]; discard:Card[]; exhaust:Card[];
 enemies:Enemy[]; turn:number; floor:number; col:number; path:string[]; map:MapNode[];
 rewards:CardId[]; relics:string[]; log:string[]; seed:number; nextUid:number; event:number;
 purchased:string[]; battles:number; lastReward:number;
};
const intent=(value:number,label='准备攻击'):Intent=>({type:'attack',value,label});
const templates = [
 {name:'迷路的小蘑菇',art:'mushroom',hp:34,intents:[intent(6,'孢子扑扑'),{type:'defend' as const,value:5,label:'缩进菌伞'},intent(10,'蘑菇头槌')]},
 {name:'软绵绵尘团',art:'dust',hp:27,intents:[intent(5,'轻轻撞一下'),intent(7,'灰尘扑扑'),{type:'grow' as const,value:2,label:'积攒灰尘'}]},
 {name:'害羞小豆芽',art:'sprout',hp:30,intents:[{type:'defend' as const,value:7,label:'叶片护盾'},intent(8,'藤蔓拍打'),intent(11,'努力生长')]},
];
function random(s:Game){s.seed = (Math.imul(s.seed,1664525)+1013904223)>>>0; return s.seed/4294967296;}
function shuffle<T>(a:T[],s:Game):T[]{ const n=[...a]; for(let i=n.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[n[i],n[j]]=[n[j],n[i]];} return n; }
function log(s:Game,t:string){s.log=[t,...s.log].slice(0,35);}
function newCard(s:Game,id:CardId):Card{return {id,uid:s.nextUid++};}
export function drawCards(s:Game,n:number){
 for(let i=0;i<n && s.hand.length<10;i++){
  if(!s.draw.length && s.discard.length){s.draw=shuffle(s.discard,s);s.discard=[];log(s,'弃牌堆已洗回抽牌堆。');}
  const c=s.draw.shift();if(c)s.hand.push(c);
 }
}
function enemy(s:Game,t:number,elite=false):Enemy{
 const e=templates[t%3],hp=e.hp+Math.max(0,s.floor-1)*3+(elite?22:0);
 return {uid:s.nextUid++,name:elite?'守卫 · '+e.name:e.name,art:e.art,hp,maxHp:hp,block:0,poison:0,vulnerable:0,strength:elite?2:0,intents:e.intents,step:0};
}
function startBattle(s:Game,kind:NodeType){
 s.phase='combat';s.energy=3;s.block=s.relics.includes('leaf')?3:0;s.strength=0;s.turn=1;s.exhaust=[];s.discard=[];s.hand=[];s.draw=shuffle(s.deck,s);
 if(kind==='boss') s.enemies=[{uid:s.nextUid++,name:'云朵棉花糖大王',art:'boss',hp:120,maxHp:120,block:0,poison:0,vulnerable:0,strength:0,intents:[intent(12,'棉花糖弹跳'),{type:'grow',value:3,label:'越变越蓬松'},intent(18,'云朵大拥抱'),{type:'defend',value:14,label:'棉花护盾'}],step:0}];
 else { s.enemies=[enemy(s,s.floor===1?0:Math.floor(random(s)*3),kind==='elite')]; if(s.floor>=4 && kind!=='elite')s.enemies.push(enemy(s,Math.floor(random(s)*3))); }
 drawCards(s,5);log(s,`第 ${s.floor} 层 · 遇见${s.enemies[0].name}。`);
}
export function createGame(seed=Date.now()>>>0):Game{
 const s:Game={version:1,phase:'map',hp:60,maxHp:60,gold:68,energy:3,block:0,strength:0,deck:[],hand:[],draw:[],discard:[],exhaust:[],enemies:[],turn:1,floor:1,col:1,path:['1-1'],map:[],rewards:[],relics:['crumb'],log:[],seed,nextUid:1,event:0,purchased:[],battles:0,lastReward:0};
 (['strike','strike','strike','strike','guard','guard','guard','guard','tail','tea','snack','hug'] as CardId[]).forEach(id=>s.deck.push(newCard(s,id)));
 for(let f=1;f<=9;f++)for(let c=0;c<3;c++){
  if((f===1||f===9)&&c!==1)continue;
  let kind:NodeType='battle';
  if(f===2)kind=c===1?'event':'battle';
  if(f===3)kind=c===0?'rest':c===1?'battle':'shop';
  if(f===4)kind=c===1?'elite':c===0?'event':'battle';
  if(f===5)kind=c===0?'shop':c===1?'rest':'event';
  if(f===6)kind=c===1?'battle':c===0?'elite':'battle';
  if(f===7)kind=c===1?'event':c===0?'rest':'shop';
  if(f===8)kind='rest';
  if(f===9)kind='boss';
  s.map.push({id:`${f}-${c}`,floor:f,col:c,kind});
 }
 startBattle(s,'battle');return s;
}
export function accessible(s:Game,n:MapNode){return s.phase==='map' && n.floor===s.floor+1 && Math.abs(n.col-s.col)<=1;}
export function enemyIntent(e:Enemy){const i=e.intents[e.step%e.intents.length];return {...i,value:i.value+(i.type==='attack'?e.strength:0)};}
function damageEnemy(e:Enemy,n:number){const amount=Math.floor(n*(e.vulnerable>0?1.5:1));const hit=Math.max(0,amount-e.block);e.block=Math.max(0,e.block-amount);e.hp=Math.max(0,e.hp-hit);return hit;}
function checkWin(s:Game){
 if(s.enemies.some(e=>e.hp>0))return false;
 s.battles++;s.hp=Math.min(s.maxHp,s.hp+4);s.block=0;
 if(s.floor===9){s.phase='victory';log(s,'抵达塔顶！最温暖的角落，原来就在伙伴身边。');return true;}
 s.lastReward=16+Math.floor(random(s)*13)+(s.map.find(n=>n.id===`${s.floor}-${s.col}`)?.kind==='elite'?15:0);s.gold+=s.lastReward;
 const pool=Object.keys(CARDS).filter(id=>!['strike','guard'].includes(id)) as CardId[];
 s.rewards=shuffle(pool,s).slice(0,3);s.phase='reward';
 if(s.map.find(n=>n.id===`${s.floor}-${s.col}`)?.kind==='elite'&&!s.relics.includes('leaf')){s.relics.push('leaf');log(s,'获得遗物「幸运四叶草」：每回合开始获得 3 点格挡。');}
 log(s,`战斗胜利！获得 ${s.lastReward} 金币，面包屑护符恢复 4 点生命。`);return true;
}
export type Action = {type:'play';uid:number;target?:number}|{type:'end'}|{type:'travel';id:string}|{type:'reward';id?:CardId}|{type:'event';choice:number}|{type:'rest';choice:'heal'|'upgrade';uid?:number}|{type:'buy';item:string}|{type:'leave'};
export function reducer(old:Game,a:Action):Game{
 const s:Game=structuredClone(old);
 if(a.type==='play'){
  if(s.phase!=='combat')return old;
  const index=s.hand.findIndex(c=>c.uid===a.uid);if(index<0)return old;
  const c=s.hand[index],d=cardDef(c);if(d.cost>s.energy)return old;
  const target=s.enemies.find(e=>e.uid===a.target&&e.hp>0)??s.enemies.find(e=>e.hp>0);if(!target)return old;
  s.energy-=d.cost;s.hand.splice(index,1);(d.exhaust?s.exhaust:s.discard).push(c);
  if(d.damage){for(const e of d.all?s.enemies.filter(e=>e.hp>0):[target])for(let k=0;k<(d.hits??1);k++)damageEnemy(e,d.damage+s.strength);}
  if(d.poison)target.poison+=d.poison;
  if(d.vulnerable)target.vulnerable+=d.vulnerable;
  if(d.block)s.block+=d.block;
  if(d.heal)s.hp=Math.min(s.maxHp,s.hp+d.heal);
  if(d.strength)s.strength+=d.strength;
  if(d.energy)s.energy+=d.energy;
  if(d.draw)drawCards(s,d.draw);
  log(s,`打出「${d.name}」${d.damage?`，攻击${d.all?'所有敌人':target.name}`:''}。`);
  checkWin(s);return s;
 }
 if(a.type==='end'){
  if(s.phase!=='combat')return old;
  s.discard.push(...s.hand);s.hand=[];
  for(const e of s.enemies.filter(e=>e.hp>0)){
   e.block=0;
   if(e.poison>0){e.hp=Math.max(0,e.hp-e.poison);log(s,`${e.name}受到 ${e.poison} 点发霉伤害。`);e.poison--;}
   if(e.hp<=0)continue;
   const i=enemyIntent(e);
   if(i.type==='attack'){
    const hit=Math.max(0,i.value-s.block);s.block=Math.max(0,s.block-i.value);s.hp=Math.max(0,s.hp-hit);log(s,`${e.name}发动${i.label}，造成 ${hit} 点伤害。`);
   }else if(i.type==='defend')e.block=i.value;else e.strength+=i.value;
   e.step++;e.vulnerable=Math.max(0,e.vulnerable-1);
   if(s.hp<=0){s.phase='defeat';log(s,'有点累了，下一次再一起出发吧。');return s;}
  }
  if(checkWin(s))return s;
  s.turn++;s.energy=3;s.block=s.relics.includes('leaf')?3:0;drawCards(s,5);log(s,`第 ${s.turn} 回合 · 恢复 3 点能量，抽 5 张牌。`);return s;
 }
 if(a.type==='reward'&&s.phase==='reward'){
  if(a.id && !s.rewards.includes(a.id))return old;
  if(a.id){s.deck.push(newCard(s,a.id));log(s,`「${CARDS[a.id].name}」加入牌组。`);}s.phase='map';return s;
 }
 if(a.type==='travel'&&s.phase==='map'){
  const n=s.map.find(n=>n.id===a.id);if(!n||!accessible(s,n))return old;
  s.floor=n.floor;s.col=n.col;s.path.push(n.id);s.purchased=[];
  if(['battle','elite','boss'].includes(n.kind))startBattle(s,n.kind);
  else if(n.kind==='event'){s.phase='event';s.event=Math.floor(random(s)*3);}
  else s.phase=n.kind as 'rest'|'shop';return s;
 }
 if(a.type==='event'&&s.phase==='event'){
  if(![0,1,2].includes(a.choice))return old;
  if(a.choice!==2){
   if(s.event===0){if(a.choice===0){s.hp=Math.min(s.maxHp,s.hp+12);log(s,'喝了森林热茶，恢复 12 点生命。');}else{s.deck.push(newCard(s,'tea'));log(s,'茶叶精灵赠送了「热茶时间」。');}}
   if(s.event===1){if(a.choice===0){s.gold+=30;log(s,'在软垫下找到 30 枚金币。');}else{s.maxHp+=6;s.hp+=6;log(s,'好好伸了个懒腰，最大生命增加 6。');}}
   if(s.event===2){if(a.choice===0){s.hp=Math.max(1,s.hp-6);s.deck.push(newCard(s,'golden'));log(s,'穿过荆棘，失去 6 点生命，获得「金色的心意」。');}else{s.deck.push(newCard(s,'hug'));log(s,'收下了伙伴的「暖暖拥抱」。');}}
  }s.phase='map';return s;
 }
 if(a.type==='rest'&&s.phase==='rest'){
  if(a.choice==='heal'){s.hp=Math.min(s.maxHp,s.hp+18);log(s,'在营火边打了个盹，恢复 18 点生命。');}
  else{const c=s.deck.find(c=>c.uid===a.uid&&!c.upgraded);if(!c)return old;c.upgraded=true;log(s,`「${CARDS[c.id].name}」升级了。`);}
  s.phase='map';return s;
 }
 if(a.type==='buy'&&s.phase==='shop'&&!s.purchased.includes(a.item)){
  const prices:Record<string,number>={tea:30,crumbs:40,golden:65,heal:25,remove:45};const p=prices[a.item];if(!p||s.gold<p)return old;
  if(a.item==='remove'){const index=s.deck.findIndex(c=>c.id==='strike'&&!c.upgraded);if(index<0)return old;s.deck.splice(index,1);}
  else if(a.item==='heal'){if(s.hp===s.maxHp)return old;s.hp=Math.min(s.maxHp,s.hp+15);}
  else s.deck.push(newCard(s,a.item as CardId));
  s.gold-=p;s.purchased.push(a.item);log(s,'和角落商人完成了一次温暖的交易。');return s;
 }
 if(a.type==='leave'&&['shop','rest'].includes(s.phase)){s.phase='map';return s;}
 return old;
}
export const SAVE_KEY='sumikko-spire-v1';
export function validateSave(x:unknown):x is Game{
 if(!x||typeof x!=='object')return false;const s=x as Game;
 return s.version===1&&['combat','reward','map','event','rest','shop','victory','defeat'].includes(s.phase)&&Number.isFinite(s.hp)&&s.hp>=0&&s.hp<=s.maxHp&&Number.isFinite(s.gold)&&s.floor>=1&&s.floor<=9&&Array.isArray(s.deck)&&s.deck.length>0&&s.deck.every(c=>c&&c.id in CARDS)&&['hand','draw','discard','exhaust','enemies','map','path','log','relics','rewards','purchased'].every(k=>Array.isArray(s[k as keyof Game]));
}
