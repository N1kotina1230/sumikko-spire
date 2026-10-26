import test from 'node:test';
import assert from 'node:assert/strict';
import {CARDS,createGame,reducer,drawCards,accessible,cardDef,validateSave,type Game,type CardId} from './game';

function withHand(id:CardId,energy=3){const s=createGame(123);const card={id,uid:999};s.hand=[card];s.draw=[];s.discard=[];s.energy=energy;return s;}
test('开局：60 HP、3 能量、5 手牌，卡牌实例守恒且随机种子可复现',()=>{
 const s=createGame(42);assert.equal(s.hp,60);assert.equal(s.energy,3);assert.equal(s.hand.length,5);assert.equal(s.deck.length,12);assert.equal(s.hand.length+s.draw.length,12);assert.equal(Object.keys(CARDS).length,16);assert.deepEqual(s,createGame(42));assert.ok(validateSave(s));assert.ok(!validateSave(null));
});
test('出牌扣能量、造成伤害、进入弃牌；不改变原状态',()=>{
 const s=withHand('strike'),r=reducer(s,{type:'play',uid:999});assert.equal(r.energy,2);assert.equal(r.enemies[0].hp,s.enemies[0].hp-6);assert.equal(r.discard.length,1);assert.equal(r.hand.length,0);assert.equal(s.energy,3);assert.equal(s.hand.length,1);
});
test('能量不足、无效卡牌和战斗外出牌被拒绝',()=>{
 const s=withHand('tempura',1);assert.equal(reducer(s,{type:'play',uid:999}),s);assert.equal(reducer(s,{type:'play',uid:111}),s);s.phase='map';assert.equal(reducer(s,{type:'play',uid:999}),s);
});
test('免费抽牌可在零能量时使用；弃牌堆洗牌且手牌不超过10',()=>{
 const s=withHand('tea',0);s.discard=[{id:'guard',uid:100},{id:'strike',uid:101}];const r=reducer(s,{type:'play',uid:999});assert.equal(r.hand.length,2);assert.equal(r.energy,0);assert.equal(r.hand.length+r.discard.length+r.draw.length,3);
 const t=createGame(3);t.hand=[...t.deck];t.hand.length=9;t.draw=[{id:'strike',uid:1000},{id:'guard',uid:1001}];drawCards(t,5);assert.equal(t.hand.length,10);assert.equal(t.draw.length,1);
});
test('格挡抵消伤害，下回合重置能量和格挡，并弃掉剩余手牌',()=>{
 let s=withHand('guard');s=reducer(s,{type:'play',uid:999});assert.equal(s.block,5);s=reducer(s,{type:'end'});assert.equal(s.hp,59);assert.equal(s.block,0);assert.equal(s.energy,3);assert.equal(s.turn,2);assert.equal(s.enemies[0].step,1);
});
test('消耗牌不洗回；治疗不能超过最大生命',()=>{
 const s=withHand('snack');s.hp=59;const r=reducer(s,{type:'play',uid:999});assert.equal(r.hp,60);assert.equal(r.exhaust[0].uid,999);assert.equal(r.discard.length,0);drawCards(r,5);assert.equal(r.hand.length,0);
});
test('勇气对连击的每一击生效；受潮增强攻击；指定敌人目标',()=>{
 const s=withHand('tail');s.strength=2;s.enemies[0].vulnerable=2;const r=reducer(s,{type:'play',uid:999});assert.equal(r.enemies[0].hp,16);
 const t=withHand('strike');t.enemies.push({...structuredClone(t.enemies[0]),uid:10000});const u=reducer(t,{type:'play',uid:999,target:10000});assert.equal(u.enemies[0].hp,34);assert.equal(u.enemies[1].hp,28);
});
test('群攻命中所有存活敌人',()=>{
 const s=withHand('whirl');s.enemies.push({...structuredClone(s.enemies[0]),uid:10000});const r=reducer(s,{type:'play',uid:999});assert.deepEqual(r.enemies.map(e=>e.hp),[26,26]);
});
test('发霉穿透格挡且致命时敌人不再行动，触发奖励',()=>{
 const s=createGame(1);s.enemies[0].poison=5;s.enemies[0].hp=4;s.enemies[0].block=10;s.hp=30;const r=reducer(s,{type:'end'});assert.equal(r.phase,'reward');assert.equal(r.hp,34);assert.equal(r.rewards.length,3);assert.equal(new Set(r.rewards).size,3);assert.equal(r.gold,s.gold+r.lastReward);
});
test('奖励仅能选候选卡一次，加入完整牌组；无效选项不改变状态',()=>{
 const s=createGame(1);s.enemies[0].hp=0;let r=reducer(s,{type:'end'});assert.equal(r.phase,'reward');assert.equal(reducer(r,{type:'reward',id:'strike'}),r);r=reducer(r,{type:'reward',id:r.rewards[0]});assert.equal(r.deck.length,13);assert.equal(r.phase,'map');assert.equal(reducer(r,{type:'reward',id:r.rewards[0]}),r);
});
test('路线只能前往下一层的相邻节点；所有路线都能抵达首领',()=>{
 const s=createGame(1);s.phase='map';const available=s.map.filter(n=>accessible(s,n));assert.equal(available.length,3);assert.equal(reducer(s,{type:'travel',id:'9-1'}),s);
 for(const n of s.map.filter(n=>n.floor<9))assert.ok(s.map.some(m=>m.floor===n.floor+1&&Math.abs(n.col-m.col)<=1));
 const r=reducer(s,{type:'travel',id:'2-1'});assert.equal(r.phase,'event');assert.equal(r.floor,2);assert.equal(r.path.at(-1),'2-1');
});
test('奇遇选项只能领取一次，生命代价不能致死',()=>{
 const s=createGame(4);s.phase='event';s.event=2;s.hp=3;let r=reducer(s,{type:'event',choice:0});assert.equal(r.hp,1);assert.equal(r.deck.at(-1)?.id,'golden');assert.equal(r.phase,'map');assert.equal(reducer(r,{type:'event',choice:0}),r);
});
test('商店拒绝透支和重复购买；购买治疗后不溢出',()=>{
 const s=createGame(3);s.phase='shop';s.gold=29;assert.equal(reducer(s,{type:'buy',item:'tea'}),s);s.gold=100;s.hp=57;let r=reducer(s,{type:'buy',item:'heal'});assert.equal(r.hp,60);assert.equal(r.gold,75);assert.equal(reducer(r,{type:'buy',item:'heal'}),r);r=reducer(r,{type:'buy',item:'tea'});assert.equal(r.deck.length,13);assert.equal(r.gold,45);
});
test('营火升级持久保存在牌组，下场战斗生效，只能休息一次',()=>{
 const s=createGame(4);s.phase='rest';const c=s.deck[0];let r=reducer(s,{type:'rest',choice:'upgrade',uid:c.uid});assert.ok(r.deck[0].upgraded);assert.equal(cardDef(r.deck[0]).damage,9);assert.equal(r.phase,'map');assert.equal(reducer(r,{type:'rest',choice:'heal'}),r);
});
test('精英奖励四叶草且下一回合提供格挡；每场战斗重置临时状态',()=>{
 const s=createGame(1);s.floor=4;s.col=1;s.enemies[0].hp=0;let r=reducer(s,{type:'end'});assert.ok(r.relics.includes('leaf'));r=reducer(r,{type:'reward'});r.floor=5;r.col=1;r=reducer(r,{type:'travel',id:'6-1'});assert.equal(r.phase,'combat');assert.equal(r.block,3);assert.equal(r.strength,0);assert.equal(r.exhaust.length,0);
});
test('击败首领触发通关；生命归零终止战斗并阻止继续出牌',()=>{
 const s=createGame(5);s.floor=9;s.enemies[0].hp=0;assert.equal(reducer(s,{type:'end'}).phase,'victory');const t=createGame(6);t.hp=1;const r=reducer(t,{type:'end'});assert.equal(r.phase,'defeat');assert.equal(r.hp,0);assert.equal(reducer(r,{type:'end'}),r);
});

// Traverse all nine floors using legal actions only: this catches dead ends across phases.
test('完整旅程可通过合法动作完成，多个种子下都不存在流程死锁',()=>{
 let wins=0;
 for(let seed=1;seed<=20;seed++){
  let s=createGame(seed);let steps=0;
  while(!['victory','defeat'].includes(s.phase)&&steps++<1500){
   const before=s;
   if(s.phase==='combat'){
    const foe=s.enemies.find(e=>e.hp>0)!;
    const intentDamage=s.enemies.filter(e=>e.hp>0).reduce((n,e)=>{const i=e.intents[e.step%e.intents.length];return n+(i.type==='attack'?i.value+e.strength:0);},0);
    const playable=s.hand.filter(c=>cardDef(c).cost<=s.energy);
    const score=(c:typeof playable[number])=>{const d=cardDef(c);return (d.draw??0)*5+(d.damage??0)*(d.hits??1)+(d.block?Math.min(d.block,Math.max(0,intentDamage-s.block))*1.7:0)+(d.heal&&s.hp<s.maxHp?d.heal*2:0)+(d.strength??0)*8+(d.poison??0)*2+(d.energy??0)*8-d.cost*2;};
    playable.sort((a,b)=>score(b)-score(a));
    const c=playable.find(c=>score(c)>0);
    s=reducer(s,c?{type:'play',uid:c.uid,target:foe.uid}:{type:'end'});
   }else if(s.phase==='reward'){
    const preference:CardId[]=['brave','golden','crumbs','warm','hug','tempura','tail','whirl','batter','curl','tea','snack','dash','picnic'];
    s=reducer(s,{type:'reward',id:[...s.rewards].sort((a,b)=>preference.indexOf(a)-preference.indexOf(b))[0]});
   }else if(s.phase==='map'){
    const priority:NodeTypeLike[]=['rest','event','battle','shop','elite','boss'];
    const nodes=s.map.filter(n=>accessible(s,n)).sort((a,b)=>priority.indexOf(a.kind)-priority.indexOf(b.kind));assert.ok(nodes.length);s=reducer(s,{type:'travel',id:nodes[0].id});
   }else if(s.phase==='event')s=reducer(s,{type:'event',choice:s.event===1?1:0});
   else if(s.phase==='rest')s=reducer(s,s.hp<s.maxHp-10?{type:'rest',choice:'heal'}:{type:'rest',choice:'upgrade',uid:s.deck.find(c=>!c.upgraded)!.uid});
   else if(s.phase==='shop')s=reducer(s,{type:'leave'});
   assert.notEqual(s,before);assert.ok(s.hp>=0&&s.hp<=s.maxHp);assert.ok(s.energy>=0);assert.ok(s.hand.length<=10);
  }
  assert.ok(steps<1500,'不得因空牌组或地图连接造成死锁');if(s.phase==='victory')wins++;
 }
 assert.ok(wins>=1,'至少有一局可在不修改状态的前提下通关');
});
type NodeTypeLike=Game['map'][number]['kind'];
