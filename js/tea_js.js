//        This JavaScript is Copyright (c) 2000, Peter J Billam
//              c/o P J B Computing, www.pjb.com.au
// It was generated by the Crypt::Tea_JS.pm Perl module and is free software;
// you can redistribute and modify it under the same terms as Perl itself.

// -- conversion routines between string, bytes, ascii encoding, & blocks --
function binary2ascii (s) {
 return bytes2ascii( blocks2bytes(s) );
}
function binary2str (s) {
 return bytes2str( blocks2bytes(s) );
}
function ascii2binary (s) {
 return bytes2blocks( ascii2bytes(s) );
}
function str2binary (s) {
 return bytes2blocks( str2bytes(s) );
}
function str2bytes(s) {   // converts string to array of bytes
 var is = 0;  var ls = s.length;  var b = new Array();
 while (1) {
  if (is >= ls) break;
  if (c2b[s.charAt(is)] == null) { b[is] = 0xF7;
   alert ('is = '+is + '\nchar = '+s.charAt(is) + '\nls = '+ls);
  } else { b[is] = c2b[s.charAt(is)];
  }
  is++;
 }
 return b;
}
function bytes2str(b) {   // converts array of bytes to string
 var ib = 0;  var lb = b.length;  var s = '';
 while (1) {
  if (ib >= lb) break;
  s += b2c[0xFF&b[ib]];   // if its like perl, could be faster with join
  ib++;
 }
 return s;
}
function ascii2bytes(a) { // converts pseudo-base64 to array of bytes
 var ia = -1;  var la = a.length;
 var ib = 0;  var b = new Array();
 var carry;
 while (1) {   // reads 4 chars and produces 3 bytes
  while (1) { ia++; if (ia>=la) return b; if (a2b[a.charAt(ia)]!=null) break; }
  b[ib]  = a2b[a.charAt(ia)]<<2;
  while (1) { ia++; if (ia>=la) return b; if (a2b[a.charAt(ia)]!=null) break; }
  carry=a2b[a.charAt(ia)];  b[ib] |= carry>>>4; ib++;
  // if low 4 bits of carry are 0 and its the last char, then break
  carry = 0xF & carry;
  if (carry == 0 && ia == (la-1)) return b;
  b[ib]  = carry<<4;
  while (1) { ia++; if (ia>=la) return b; if (a2b[a.charAt(ia)]!=null) break; }
  carry=a2b[a.charAt(ia)];  b[ib] |= carry>>>2; ib++;
  // if low 2 bits of carry are 0 and its the last char, then break
  carry = 3 & carry;
  if (carry == 0 && ia == (la-1)) return b;
  b[ib]  = carry<<6;
  while (1) { ia++; if (ia>=la) return b; if (a2b[a.charAt(ia)]!=null) break; }
  b[ib] |= a2b[a.charAt(ia)];   ib++;
 }
 return b;
}
function bytes2ascii(b) { // converts array of bytes to pseudo-base64 ascii
 var ib = 0;   var lb = b.length;  var s = '';
 var b1; var b2; var b3;
 var carry;
 while (1) {   // reads 3 bytes and produces 4 chars
  if (ib >= lb) break;   b1 = 0xFF & b[ib];
  s += b2a[63 & (b1>>>2)];
  carry = 3 & b1;
  ib++;  if (ib >= lb) { s += b2a[carry<<4]; break; }  b2 = 0xFF & b[ib];
  s += b2a[(0xF0 & (carry<<4)) | (b2>>>4)];
  carry = 0xF & b2;
  ib++;  if (ib >= lb) { s += b2a[carry<<2]; break; }  b3 = 0xFF & b[ib];
  s += b2a[(60 & (carry<<2)) | (b3>>>6)] + b2a[63 & b3];
  ib++;
  if (ib % 36 == 0) s += "\n";
 }
 return s;
}
function bytes2blocks(bytes) {
 var blocks = new Array(); var ibl = 0;
 var iby = 0; var nby = bytes.length;
 while (1) {
  blocks[ibl]  = (0xFF & bytes[iby])<<24; iby++; if (iby >= nby) break;
  blocks[ibl] |= (0xFF & bytes[iby])<<16; iby++; if (iby >= nby) break;
  blocks[ibl] |= (0xFF & bytes[iby])<<8;  iby++; if (iby >= nby) break;
  blocks[ibl] |=  0xFF & bytes[iby];      iby++; if (iby >= nby) break;
  ibl++;
 }
 return blocks;
}
function blocks2bytes(blocks) {
 var bytes = new Array(); var iby = 0;
 var ibl = 0; var nbl = blocks.length;
 while (1) {
  if (ibl >= nbl) break;
  bytes[iby] = 0xFF & (blocks[ibl] >>> 24); iby++;
  bytes[iby] = 0xFF & (blocks[ibl] >>> 16); iby++;
  bytes[iby] = 0xFF & (blocks[ibl] >>> 8);  iby++;
  bytes[iby] = 0xFF & blocks[ibl]; iby++;
  ibl++;
 }
 return bytes;
}
function digest_pad (bytearray) {
 // add 1 char ('0'..'15') at front to specify no of \x00 pad chars at end
 var newarray = new Array();  var ina = 0;
 var iba = 0; var nba = bytearray.length;
 var npads = 15 - (nba % 16); newarray[ina] = npads; ina++;
 while (iba < nba) { newarray[ina] = bytearray[iba]; ina++; iba++; }
 var ip = npads; while (ip>0) { newarray[ina] = 0; ina++; ip--; }
 return newarray;
}
function pad (bytearray) {
 // add 1 char ('0'..'7') at front to specify no of rand pad chars at end
 // unshift and push fail on Netscape 4.7 :-(
 var newarray = new Array();  var ina = 0;
 var iba = 0; var nba = bytearray.length;
 var npads = 7 - (nba % 8);
 newarray[ina] = (0xF8 & rand_byte()) | (7 & npads); ina++;
 while (iba < nba) { newarray[ina] = bytearray[iba]; ina++; iba++; }
 var ip = npads; while (ip>0) { newarray[ina] = rand_byte(); ina++; ip--; }
 return newarray;
}
function rand_byte() {   // used by pad
 return Math.floor( 256*Math.random() );  // Random needs js1.1 . Seed ?
 // for js1.0 compatibility, could try following ...
 if (! rand_byte_already_called) {
  var now = new Date();  seed = now.milliseconds;
  rand_byte_already_called = true;
 }
 seed = (1029*seed + 221591) % 1048576;  // see Fortran77, Wagener, p177
 return Math.floor(seed / 4096);
}
function unpad (bytearray) {
 // remove no of pad chars at end specified by 1 char ('0'..'7') at front
 // unshift and push fail on Netscape 4.7 :-(
 var iba = 0;
 var newarray = new Array();  var ina = 0;
 var npads = 0x7 & bytearray[iba]; iba++; var nba = bytearray.length - npads;
 while (iba < nba) { newarray[ina] = bytearray[iba]; ina++; iba++; }
 return newarray;
}

// --- TEA stuff, translated from the Perl Tea_JS.pm see www.pjb.com.au/comp ---

// In JavaScript we express an 8-byte block as an array of 2 32-bit ints
function asciidigest (str) {
 return binary2ascii( binarydigest(str) );
}
function binarydigest (str, keystr) {  // returns 22-char ascii signature
 var key = new Array(); // key = binarydigest(keystr);
 key[0]=0x61626364; key[1]=0x62636465; key[2]=0x63646566; key[3]=0x64656667;

 // Initial Value for CBC mode = "abcdbcde". Retain for interoperability.
 var c0 = new Array(); c0[0] = 0x61626364; c0[1] = 0x62636465;
 var c1 = new Array(); c1 = c0;

 var v0 = new Array(); var v1 = new Array(); var swap;
 var blocks = new Array(); blocks = bytes2blocks(digest_pad(str2bytes(str))); 
 var ibl = 0;   var nbl = blocks.length;
 while (1) {
  if (ibl >= nbl) break;
  v0[0] = blocks[ibl]; ibl++; v0[1] = blocks[ibl]; ibl++;
  v1[0] = blocks[ibl]; ibl++; v1[1] = blocks[ibl]; ibl++;
  // cipher them XOR'd with previous stage ...
  c0 = tea_code( xor_blocks(v0,c0), key );
  c1 = tea_code( xor_blocks(v1,c1), key );
  // mix up the two cipher blocks with a 32-bit left rotation ...
  swap=c0[0]; c0[0]=c0[1]; c0[1]=c1[0]; c1[0]=c1[1]; c1[1]=swap;
 }
 var concat = new Array();
 concat[0]=c0[0]; concat[1]=c0[1]; concat[2]=c1[0]; concat[3]=c1[1];
 return concat;
}
function encrypt (str,keystr) {  // encodes with CBC (Cipher Block Chaining)
 if (! keystr) { alert("encrypt: no key"); return false; }
 var key = new Array();  key = binarydigest(keystr);
 if (! str) return "";
 var blocks = new Array(); blocks = bytes2blocks(pad(str2bytes(str)));
 var ibl = 0;  var nbl = blocks.length;
 // Initial Value for CBC mode = "abcdbcde". Retain for interoperability.
 var c = new Array(); c[0] = 0x61626364; c[1] = 0x62636465;
 var v = new Array(); var cblocks = new Array();  var icb = 0;
 while (1) {
  if (ibl >= nbl) break;
  v[0] = blocks[ibl];  ibl++; v[1] = blocks[ibl];  ibl++;
  c = tea_code( xor_blocks(v,c), key );
  cblocks[icb] = c[0]; icb++; cblocks[icb] = c[1]; icb++;
 }
 return binary2ascii(cblocks);
}
function decrypt (ascii, keystr) {   // decodes with CBC
 if (! keystr) { alert("decrypt: no key"); return false; }
 var key = new Array();  key = binarydigest(keystr);
 if (! ascii) return "";
 var cblocks = new Array(); cblocks = ascii2binary(ascii);
 var icbl = 0;  var ncbl = cblocks.length;
 // Initial Value for CBC mode = "abcdbcde". Retain for interoperability.
 var lastc = new Array(); lastc[0] = 0x61626364; lastc[1] = 0x62636465;
 var v = new Array(); var c = new Array();
 var blocks = new Array(); var ibl = 0;
 while (1) {
  if (icbl >= ncbl) break;
  c[0] = cblocks[icbl];  icbl++;  c[1] = cblocks[icbl];  icbl++;
  v = xor_blocks( lastc, tea_decode(c,key) );
  blocks[ibl] = v[0];  ibl++;  blocks[ibl] = v[1];  ibl++;
  lastc[0] = c[0]; lastc[1] = c[1];
 }
 return bytes2str(unpad(blocks2bytes(blocks)));
}
function xor_blocks(blk1, blk2) { // xor of two 8-byte blocks
 var blk = new Array();
 blk[0] = blk1[0]^blk2[0]; blk[1] = blk1[1]^blk2[1];
 return blk;
}
function tea_code (v, k) {
 // NewTEA. 2-int (64-bit) cyphertext block in v. 4-int (128-bit) key in k.
 var v0  = v[0]; var v1 = v[1];
 var sum = 0; var n = 32;
 while (n-- > 0) {
  v0 += (((v1<<4)^(v1>>>5))+v1) ^ (sum+k[sum&3]) ; v0 = v0|0 ;
  sum -= 1640531527; // TEA magic number 0x9e3779b9 
  sum = sum|0;  // force it back to 32-bit int
  v1 += (((v0<<4)^(v0>>>5))+v0) ^ (sum+k[(sum>>>11)&3]); v1 = v1|0 ;
 }
 var w = new Array(); w[0] = v0; w[1] = v1; return w;
}
function tea_decode (v, k) {
 // NewTEA. 2-int (64-bit) cyphertext block in v. 4-int (128-bit) key in k.
 var v0 = v[0]; var v1 = v[1];
 var sum = 0; var n = 32;
 sum = -957401312 ; // TEA magic number 0x9e3779b9<<5 
 while (n-- > 0) {
  v1 -= (((v0<<4)^(v0>>>5))+v0) ^ (sum+k[(sum>>>11)&3]); v1 = v1|0 ;
  sum += 1640531527; // TEA magic number 0x9e3779b9 ;
  sum = sum|0; // force it back to 32-bit int
  v0 -= (((v1<<4)^(v1>>>5))+v1) ^ (sum+k[sum&3]); v0 = v0|0 ;
 }
 var w = new Array(); w[0] = v0; w[1] = v1; return w;
}

// ------------- assocarys used by the conversion routines -----------
c2b = new Object();
c2b["\x00"]=0;  c2b["\x01"]=1;  c2b["\x02"]=2;  c2b["\x03"]=3;
c2b["\x04"]=4;  c2b["\x05"]=5;  c2b["\x06"]=6;  c2b["\x07"]=7;
c2b["\x08"]=8;  c2b["\x09"]=9;  c2b["\x0A"]=10; c2b["\x0B"]=11;
c2b["\x0C"]=12; c2b["\x0D"]=13; c2b["\x0E"]=14; c2b["\x0F"]=15;
c2b["\x10"]=16; c2b["\x11"]=17; c2b["\x12"]=18; c2b["\x13"]=19;
c2b["\x14"]=20; c2b["\x15"]=21; c2b["\x16"]=22; c2b["\x17"]=23;
c2b["\x18"]=24; c2b["\x19"]=25; c2b["\x1A"]=26; c2b["\x1B"]=27;
c2b["\x1C"]=28; c2b["\x1D"]=29; c2b["\x1E"]=30; c2b["\x1F"]=31;
c2b["\x20"]=32; c2b["\x21"]=33; c2b["\x22"]=34; c2b["\x23"]=35;
c2b["\x24"]=36; c2b["\x25"]=37; c2b["\x26"]=38; c2b["\x27"]=39;
c2b["\x28"]=40; c2b["\x29"]=41; c2b["\x2A"]=42; c2b["\x2B"]=43;
c2b["\x2C"]=44; c2b["\x2D"]=45; c2b["\x2E"]=46; c2b["\x2F"]=47;
c2b["\x30"]=48; c2b["\x31"]=49; c2b["\x32"]=50; c2b["\x33"]=51;
c2b["\x34"]=52; c2b["\x35"]=53; c2b["\x36"]=54; c2b["\x37"]=55;
c2b["\x38"]=56; c2b["\x39"]=57; c2b["\x3A"]=58; c2b["\x3B"]=59;
c2b["\x3C"]=60; c2b["\x3D"]=61; c2b["\x3E"]=62; c2b["\x3F"]=63;
c2b["\x40"]=64; c2b["\x41"]=65; c2b["\x42"]=66; c2b["\x43"]=67;
c2b["\x44"]=68; c2b["\x45"]=69; c2b["\x46"]=70; c2b["\x47"]=71;
c2b["\x48"]=72; c2b["\x49"]=73; c2b["\x4A"]=74; c2b["\x4B"]=75;
c2b["\x4C"]=76; c2b["\x4D"]=77; c2b["\x4E"]=78; c2b["\x4F"]=79;
c2b["\x50"]=80; c2b["\x51"]=81; c2b["\x52"]=82; c2b["\x53"]=83;
c2b["\x54"]=84; c2b["\x55"]=85; c2b["\x56"]=86; c2b["\x57"]=87;
c2b["\x58"]=88; c2b["\x59"]=89; c2b["\x5A"]=90; c2b["\x5B"]=91;
c2b["\x5C"]=92; c2b["\x5D"]=93; c2b["\x5E"]=94; c2b["\x5F"]=95;
c2b["\x60"]=96; c2b["\x61"]=97; c2b["\x62"]=98; c2b["\x63"]=99;
c2b["\x64"]=100; c2b["\x65"]=101; c2b["\x66"]=102; c2b["\x67"]=103;
c2b["\x68"]=104; c2b["\x69"]=105; c2b["\x6A"]=106; c2b["\x6B"]=107;
c2b["\x6C"]=108; c2b["\x6D"]=109; c2b["\x6E"]=110; c2b["\x6F"]=111;
c2b["\x70"]=112; c2b["\x71"]=113; c2b["\x72"]=114; c2b["\x73"]=115;
c2b["\x74"]=116; c2b["\x75"]=117; c2b["\x76"]=118; c2b["\x77"]=119;
c2b["\x78"]=120; c2b["\x79"]=121; c2b["\x7A"]=122; c2b["\x7B"]=123;
c2b["\x7C"]=124; c2b["\x7D"]=125; c2b["\x7E"]=126; c2b["\x7F"]=127;
c2b["\x80"]=128; c2b["\x81"]=129; c2b["\x82"]=130; c2b["\x83"]=131;
c2b["\x84"]=132; c2b["\x85"]=133; c2b["\x86"]=134; c2b["\x87"]=135;
c2b["\x88"]=136; c2b["\x89"]=137; c2b["\x8A"]=138; c2b["\x8B"]=139;
c2b["\x8C"]=140; c2b["\x8D"]=141; c2b["\x8E"]=142; c2b["\x8F"]=143;
c2b["\x90"]=144; c2b["\x91"]=145; c2b["\x92"]=146; c2b["\x93"]=147;
c2b["\x94"]=148; c2b["\x95"]=149; c2b["\x96"]=150; c2b["\x97"]=151;
c2b["\x98"]=152; c2b["\x99"]=153; c2b["\x9A"]=154; c2b["\x9B"]=155;
c2b["\x9C"]=156; c2b["\x9D"]=157; c2b["\x9E"]=158; c2b["\x9F"]=159;
c2b["\xA0"]=160; c2b["\xA1"]=161; c2b["\xA2"]=162; c2b["\xA3"]=163;
c2b["\xA4"]=164; c2b["\xA5"]=165; c2b["\xA6"]=166; c2b["\xA7"]=167;
c2b["\xA8"]=168; c2b["\xA9"]=169; c2b["\xAA"]=170; c2b["\xAB"]=171;
c2b["\xAC"]=172; c2b["\xAD"]=173; c2b["\xAE"]=174; c2b["\xAF"]=175;
c2b["\xB0"]=176; c2b["\xB1"]=177; c2b["\xB2"]=178; c2b["\xB3"]=179;
c2b["\xB4"]=180; c2b["\xB5"]=181; c2b["\xB6"]=182; c2b["\xB7"]=183;
c2b["\xB8"]=184; c2b["\xB9"]=185; c2b["\xBA"]=186; c2b["\xBB"]=187;
c2b["\xBC"]=188; c2b["\xBD"]=189; c2b["\xBE"]=190; c2b["\xBF"]=191;
c2b["\xC0"]=192; c2b["\xC1"]=193; c2b["\xC2"]=194; c2b["\xC3"]=195;
c2b["\xC4"]=196; c2b["\xC5"]=197; c2b["\xC6"]=198; c2b["\xC7"]=199;
c2b["\xC8"]=200; c2b["\xC9"]=201; c2b["\xCA"]=202; c2b["\xCB"]=203;
c2b["\xCC"]=204; c2b["\xCD"]=205; c2b["\xCE"]=206; c2b["\xCF"]=207;
c2b["\xD0"]=208; c2b["\xD1"]=209; c2b["\xD2"]=210; c2b["\xD3"]=211;
c2b["\xD4"]=212; c2b["\xD5"]=213; c2b["\xD6"]=214; c2b["\xD7"]=215;
c2b["\xD8"]=216; c2b["\xD9"]=217; c2b["\xDA"]=218; c2b["\xDB"]=219;
c2b["\xDC"]=220; c2b["\xDD"]=221; c2b["\xDE"]=222; c2b["\xDF"]=223;
c2b["\xE0"]=224; c2b["\xE1"]=225; c2b["\xE2"]=226; c2b["\xE3"]=227;
c2b["\xE4"]=228; c2b["\xE5"]=229; c2b["\xE6"]=230; c2b["\xE7"]=231;
c2b["\xE8"]=232; c2b["\xE9"]=233; c2b["\xEA"]=234; c2b["\xEB"]=235;
c2b["\xEC"]=236; c2b["\xED"]=237; c2b["\xEE"]=238; c2b["\xEF"]=239;
c2b["\xF0"]=240; c2b["\xF1"]=241; c2b["\xF2"]=242; c2b["\xF3"]=243;
c2b["\xF4"]=244; c2b["\xF5"]=245; c2b["\xF6"]=246; c2b["\xF7"]=247;
c2b["\xF8"]=248; c2b["\xF9"]=249; c2b["\xFA"]=250; c2b["\xFB"]=251;
c2b["\xFC"]=252; c2b["\xFD"]=253; c2b["\xFE"]=254; c2b["\xFF"]=255;
b2c = new Object();
for (b in c2b) { b2c[c2b[b]] = b; }

// ascii to 6-bit bin to ascii
a2b = new Object();
a2b["A"]=0;  a2b["B"]=1;  a2b["C"]=2;  a2b["D"]=3;
a2b["E"]=4;  a2b["F"]=5;  a2b["G"]=6;  a2b["H"]=7;
a2b["I"]=8;  a2b["J"]=9;  a2b["K"]=10; a2b["L"]=11;
a2b["M"]=12; a2b["N"]=13; a2b["O"]=14; a2b["P"]=15;
a2b["Q"]=16; a2b["R"]=17; a2b["S"]=18; a2b["T"]=19;
a2b["U"]=20; a2b["V"]=21; a2b["W"]=22; a2b["X"]=23;
a2b["Y"]=24; a2b["Z"]=25; a2b["a"]=26; a2b["b"]=27;
a2b["c"]=28; a2b["d"]=29; a2b["e"]=30; a2b["f"]=31;
a2b["g"]=32; a2b["h"]=33; a2b["i"]=34; a2b["j"]=35;
a2b["k"]=36; a2b["l"]=37; a2b["m"]=38; a2b["n"]=39;
a2b["o"]=40; a2b["p"]=41; a2b["q"]=42; a2b["r"]=43;
a2b["s"]=44; a2b["t"]=45; a2b["u"]=46; a2b["v"]=47;
a2b["w"]=48; a2b["x"]=49; a2b["y"]=50; a2b["z"]=51;
a2b["0"]=52; a2b["1"]=53; a2b["2"]=54; a2b["3"]=55;
a2b["4"]=56; a2b["5"]=57; a2b["6"]=58; a2b["7"]=59;
a2b["8"]=60; a2b["9"]=61; a2b["-"]=62; a2b["_"]=63;

b2a = new Object();
for (b in a2b) { b2a[a2b[b]] = ''+b; }
