import { createContext, useContext } from 'react';
import { publicAsset } from './assets';

export const DEFAULT_CHARACTER_IMAGE=publicAsset('art/ebifurai.png');
export const CharacterImageContext=createContext(DEFAULT_CHARACTER_IMAGE);

export function Character({kind='shrimp',className='',mood='normal'}:{kind?:string;className?:string;mood?:string}) {
 const characterImage=useContext(CharacterImageContext);
 return <svg className={className} viewBox="0 0 240 230" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

  <ellipse cx="121" cy="211" rx="68" ry="10" fill="#6e7950" opacity=".12"/>
  {kind==='shrimp'&&<g data-character="ebifurai-no-shippo" data-mood={mood}>
   <image href={characterImage} x="13" y="0" width="214" height="211" preserveAspectRatio="xMidYMax meet"/>
  </g>}
  {kind==='mushroom'&&<g stroke="#6c8067" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
   <path d="M80 113c-9 34-13 78 11 87h56c24-8 17-53 9-87" fill="#fcf0d4"/>
   <path d="M43 107C45 73 77 40 119 39c44-1 75 34 79 68c-12 25-142 25-155 0Z" fill="#a9b997"/>
   <path d="M45 108q72-13 151 0" stroke="#839b7b"/>
   <path d="M72 87q-8-14 7-18q11 2 9 11q-3 11-16 7Zm47-33q19-6 22 7q-2 9-15 8q-13-2-7-15Zm40 31q15-15 22-1q3 12-11 15q-10 0-11-14Z" fill="#edf0dc" stroke="none"/>
   <circle cx="102" cy="145" r="2.6" fill="#6f7157" stroke="none"/><circle cx="138" cy="145" r="2.6" fill="#6f7157" stroke="none"/><path d="M116 155h8"/>
   <ellipse cx="91" cy="155" rx="9" ry="4" fill="#e8ba9d" stroke="none"/><ellipse cx="149" cy="155" rx="9" ry="4" fill="#e8ba9d" stroke="none"/>
   <path d="m151 149-23 35" stroke="#b6986d"/><rect x="118" y="175" width="33" height="25" rx="9" fill="#d2b486" stroke="#a28d65"/><path d="m95 201-5 6m53-6 4 6"/>
  </g>}
  {kind==='dust'&&<g stroke="#918a9c" strokeWidth="2.7" strokeLinecap="round">
   <path d="M76 74q-4-22 16-19q10-20 26-8q21-17 31 3q26-1 23 23q25 9 15 31q21 17 5 35q16 26-7 37q-1 28-27 24q-16 18-33 4q-24 12-37-7q-27 5-28-18q-23-11-13-31q-19-20-1-37q-10-25 18-31Z" fill="#d7d1df"/>
   <circle cx="100" cy="122" r="3" fill="#777083"/><circle cx="140" cy="122" r="3" fill="#777083"/><path d="M115 137q6-5 12 0"/><path d="m41 79-10-7m161-4 9-8m-8 125 11 5M37 156l-11 1"/><ellipse cx="86" cy="134" rx="9" ry="5" fill="#d7b4bb" stroke="none"/><ellipse cx="153" cy="134" rx="9" ry="5" fill="#d7b4bb" stroke="none"/>
  </g>}
  {kind==='sprout'&&<g stroke="#788768" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
   <path d="M122 83q-7-34 3-53m-4 32Q75 70 79 28q36-2 42 34Zm3-15q6-37 42-31q-1 34-42 31Z" fill="#a8bf8c"/>
   <path d="M121 78c-59 0-66 40-62 82c3 39 36 43 62 43c37 0 61-7 63-43c3-42-13-82-63-82Z" fill="#e7e8bd"/>
   <circle cx="102" cy="128" r="2.5" fill="#667154"/><circle cx="139" cy="128" r="2.5" fill="#667154"/><path d="M117 140h7"/><path d="m62 153-14 3m136-3 12 2m-98 45-7 8m50-8 6 8"/><ellipse cx="89" cy="141" rx="9" ry="4" fill="#e3bf9e" stroke="none"/><ellipse cx="152" cy="141" rx="9" ry="4" fill="#e3bf9e" stroke="none"/>
  </g>}
  {kind==='boss'&&<g stroke="#968ca4" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
   <path d="m99 54-7-31 22 15 15-23 13 24 22-13-7 33" fill="#e5c78a" stroke="#af945d"/>
   <path d="M63 98Q32 58 70 57Q89 26 113 51Q151 24 165 61Q205 55 194 92Q225 119 201 140Q222 173 190 182Q178 212 148 198Q122 220 100 199Q65 215 53 182Q24 178 40 149Q13 119 42 105Z" fill="#e3dce9"/>
   <circle cx="97" cy="117" r="3" fill="#84778c"/><circle cx="146" cy="117" r="3" fill="#84778c"/><path d="M114 133q8 8 16 0"/><ellipse cx="81" cy="131" rx="11" ry="5" fill="#dab6c5" stroke="none"/><ellipse cx="162" cy="131" rx="11" ry="5" fill="#dab6c5" stroke="none"/><path d="M84 175q38 14 76 0" stroke="#cdc0d8"/>
  </g>}
 </svg>;
}

export function CardArt({kind}:{kind:string}){
 const defensive=['guard','curl','hug','picnic','batter'].includes(kind);
 return <svg viewBox="0 0 200 112" fill="none" className="card-art" aria-hidden="true">
  <ellipse cx="100" cy="96" rx="59" ry="8" fill={defensive?'#b3c0a0':'#dfc68d'} opacity=".22"/>
  {['strike','tail','tempura','dash','whirl','golden','brave','warm'].includes(kind)&&<>
   <path d="m42 49-14-8m16 22-20 1m130-22 15-11m-12 25 22 1" stroke="#d6b574" strokeWidth="2" strokeLinecap="round"/>
   {kind==='tail'&&<path d="m155 73 20-3m-22 14 15 8" stroke="#d6b574" strokeWidth="2"/>}
   {kind==='whirl'&&<path d="M47 85c-49-30 112-59 129-24s-137 44-147 17" stroke="#b8c6a0" strokeWidth="3" strokeDasharray="4 4"/>}
   {['warm','brave','golden'].includes(kind)&&<path d="m151 22 4 11 12 2-10 7 2 12-9-7-10 6 3-12-9-7 12-1 5-11Z" fill="#edce73" stroke="#c6a258" strokeWidth="1.5"/>}
   <g transform={kind==='dash'?'translate(24 0) rotate(12 90 60)':'translate(19 -7)'}><svg width="160" height="125" viewBox="0 0 240 230"><Character/></svg></g>
  </>}
  {defensive&&<>
   <path d="M58 87 52 38q46-22 92 0l-6 49-39 16Z" fill="#d1ddc1" stroke="#91a17c" strokeWidth="2"/>
   <g transform="translate(34 -7)"><svg width="133" height="113" viewBox="0 0 240 230"><Character/></svg></g>
   {kind==='curl'&&<path d="M62 61q38 18 75 0l6 35H56Z" fill="#c3cfc3" stroke="#92a48d" strokeWidth="2"/>}
   {kind==='hug'&&<><path d="M48 31c-13-16-26 7 0 17 26-10 13-33 0-17Z" fill="#dca994"/><path d="M158 39c-11-13-22 6 0 14 22-8 11-27 0-14Z" fill="#dca994"/></>}
   {kind==='picnic'&&<path d="M47 94h108l-17-14H62Z" fill="#d9ad92"/>}
  </>}
  {kind==='tea'&&<g stroke="#9f9776" strokeWidth="2.3" strokeLinecap="round"><ellipse cx="97" cy="91" rx="51" ry="8" fill="#e5d9b7"/><path d="M65 48h65v22q-4 24-32 24T65 70Z" fill="#f6f2df"/><path d="M130 52q28-3 21 18q-6 10-23 5"/><ellipse cx="97" cy="49" rx="32" ry="7" fill="#b9c6a0"/><path d="M88 32q-9-10 1-20m16 20q9-9 1-20" stroke="#bdc4ad"/><path d="M86 69q10 10 21 0"/><circle cx="82" cy="65" r="1.2"/><circle cx="112" cy="65" r="1.2"/></g>}
  {kind==='snack'&&<g stroke="#ad8860" strokeWidth="2.2"><ellipse cx="100" cy="87" rx="55" ry="12" fill="#eee2bd"/><path d="m65 76 7-43 58 4 10 40q-35 18-75-1Z" fill="#e8bc81"/><path d="m71 44 59 5-3-13-53-4Z" fill="#f5e3b6"/><path d="M102 33q-15-19 0-24q16 6 0 24Z" fill="#d69d83"/><path d="m86 59 4 1m21 0 4 1" strokeLinecap="round"/></g>}
  {kind==='crumbs'&&<g fill="#e6c68c" stroke="#b49865" strokeWidth="1.5"><path d="m73 42 17-9 10 19-24 6Z"/><path d="m119 71 14-14 15 19-15 12Z"/><path d="m57 79 8-10 12 13-13 6Z"/><path d="m120 28 9-5 7 13-12 3Z"/><path d="m94 82 7-4 5 10-9 4Z"/><path d="M52 95q45-15 98 0" stroke="#a9b38c" strokeDasharray="4 4"/></g>}
 </svg>;
}

export function Forest(){
 return <svg viewBox="0 0 1100 450" preserveAspectRatio="xMidYMax slice" className="forest" aria-hidden="true">
  <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#f7f5e7"/><stop offset="1" stopColor="#e8ebd7"/></linearGradient><pattern id="grain" width="37" height="31" patternUnits="userSpaceOnUse"><circle cx="8" cy="9" r=".7" fill="#a2a98b" opacity=".25"/><circle cx="24" cy="24" r=".6" fill="#a2a98b" opacity=".25"/></pattern></defs>
  <rect width="1100" height="450" fill="url(#sky)"/>
  <circle cx="846" cy="102" r="41" fill="#f1e8bc" opacity=".6"/>
  <g fill="#e1e5cd"><path d="M0 244Q120 120 255 225T520 202T790 202T1100 167V450H0Z"/></g>
  <path d="M0 316Q142 221 324 286T641 266T930 280T1100 254V450H0Z" fill="#d4dec4"/>
  <g stroke="#abb99a" strokeWidth="2" fill="none" opacity=".7"><path d="M86 304V114m0 76-27-29m27 5 30-35m-28 91-33-26"/><path d="M1006 296V125m0 72-25-24m25-11 26-29m-27 103 31-32"/></g>
  <g fill="#c2cfaf"><path d="M20 241q-35-20-12-49q-22-31 9-45q-9-33 22-36q6-39 36-17q32-19 38 15q35 0 28 34q31 25 4 46q20 32-16 45q-29 23-52 6Z"/><path d="M963 247q-29-21-12-49q-17-33 12-45q-8-33 18-39q15-32 33-13q29-16 39 15q26 5 20 33q27 21 5 43q15 33-14 44q-32 18-59 5Z"/></g>
  <g stroke="#a5b58f" strokeWidth="3"><path d="M76 307V150m0 57-24-20m24 54 31-27m895 84V156m0 44 24-18m-24 56-24-25"/></g>
  <path d="M0 367q142-64 283-17q205-70 383-6q226-77 434 3V450H0Z" fill="#e0e5ce"/>
  <path d="M268 450Q432 364 618 450" fill="#eee8cc"/>
  <g stroke="#9fae86" strokeWidth="2" strokeLinecap="round" fill="none"><path d="m42 380 3-9 4 8m65 27 4-12 6 10m98-36 3-9 4 8m513 35 4-11 6 10m175-32 4-10 6 8m93 36 4-13 7 11m-752-6 3-8 5 8m655-27 2-8 5 6"/></g>
  <g fill="#f4edcf" stroke="#bfc49e" strokeWidth="1.4"><path d="M158 345v-13m-9 3q-3-10 7-8q6-8 9 1q12 1 4 9q-3 10-11 3q-10 6-9-5Z"/><path d="M915 353v-13m-9 3q-3-10 7-8q6-8 9 1q12 1 4 9q-3 10-11 3q-10 6-9-5Z"/></g>
  <g fill="#b8c5a1"><ellipse cx="32" cy="428" rx="79" ry="24"/><ellipse cx="1092" cy="416" rx="85" ry="35"/></g>
  <rect width="1100" height="450" fill="url(#grain)"/>
 </svg>;
}
