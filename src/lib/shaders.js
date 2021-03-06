// Autogenerated by shadermin.js
// Do not modify manually

const ATTRIBUTE_COLOR = 'a';
const ATTRIBUTE_POSITION = 'b';
const ATTRIBUTE_TEXCOORD = 'c';
const ATTRIBUTE_WORLDMATRIX = 'd';
const UNIFORM_BLOOMTEXTURE = 'f';
const UNIFORM_COLORTEXTURE = 'g';
const UNIFORM_DEPTHTEXTURE = 'h';
const UNIFORM_ITERATION = 'i';
const UNIFORM_LIGHTCOLORS = 'j';
const UNIFORM_LIGHTPOSITIONS = 'k';
const UNIFORM_PROJECTIONMATRIX = 'l';
const UNIFORM_SHADOWMAPMATRIX = 'm';
const UNIFORM_VIEWMATRIX = 'n';

const GLSL_PREFIX =
  '#version 300 es\n' +
  'precision highp float;';

const BLOOM_FRAG =
  GLSL_PREFIX +
  'uniform sampler2D g;' +
  'uniform int i;' +
  'in vec2 s;' +
  'out vec4 e;' +
  'float w=0.99;' +
  'float x[11]=float[11](0.01,0.02,0.04,0.08,0.16,0.38,0.16,0.08,0.04,0.02,0.01);' +
  'void main(){' +
  'if(i==0){' +
  'vec4 t=texture(g,s);' +
  'if(t.r>w||t.g>w||t.b>w){' +
  'e=t;' +
  '}' +
  'else{' +
  'discard;' +
  '}' +
  '}' +
  'else if(i==1||i==3){' +
  'vec4 u=vec4(0);' +
  'float v=0.0;' +
  'for(int xi=-5;' +
  'xi<=5;' +
  'xi++){' +
  'vec4 t=texture(g,s+vec2(float(xi)/512.0,0.0));' +
  'u.rgb+=x[xi+5]*t.rgb*t.a;' +
  'v+=x[xi+5]*t.a;' +
  '}' +
  'if(v==0.0){' +
  'e=vec4(0,0,0,1);' +
  '}' +
  'else{' +
  'u.rgb/=v;' +
  'u.a=v;' +
  'e=u;' +
  '}' +
  '}' +
  'else{' +
  'vec4 u=vec4(0);' +
  'float v=0.0;' +
  'for(int yi=-5;' +
  'yi<=5;' +
  'yi++){' +
  'vec4 t=texture(g,s+vec2(0.0,float(yi)/512.0));' +
  'u.rgb+=x[yi+5]*t.rgb*t.a;' +
  'v+=x[yi+5]*t.a;' +
  '}' +
  'if(v==0.0){' +
  'e=vec4(0,0,0,1);' +
  '}' +
  'else{' +
  'u.rgb/=v;' +
  'u.a=v;' +
  'e=u;' +
  '}' +
  '}' +
  '}';

const BLOOM_VERT =
  GLSL_PREFIX +
  'in vec2 b;' +
  'in vec2 c;' +
  'out vec2 s;' +
  'void main(){' +
  'gl_Position=vec4(b,0,1);' +
  's=c;' +
  '}';

const MAIN_FRAG =
  GLSL_PREFIX +
  'uniform sampler2D g;' +
  'uniform sampler2D h;' +
  'uniform vec3 k[16];' +
  'uniform vec3 j[16];' +
  'in vec4 o;' +
  'in float p;' +
  'in vec4 q;' +
  'in vec4 r;' +
  'out vec4 e;' +
  'void main(){' +
  'if(o.r>0.99||o.g>0.99||o.b>0.99){' +
  'e=o;' +
  'return;' +
  '}' +
  'if(o.r<0.1&&o.g<0.1&&o.b<0.1){' +
  'vec3 v=normalize(normalize((-q).xyz)-.5);' +
  'float w,cody_a=w=0.;' +
  'for(int cody_i=0;' +
  'cody_i<15;' +
  'cody_i+=1){' +
  'v=abs(v)/dot(v,v)-.49;' +
  'cody_a+=abs(length(v)-w);' +
  'w=length(v);' +
  '}' +
  'cody_a*=cody_a*cody_a;' +
  'e.rgb=.5*clamp((pow(vec3(cody_a/2e5,cody_a/2e5,cody_a/1e5),vec3(.9))),0.,2.)+vec3(0.03,0.0,0.12);' +
  'e.a=1.0;' +
  'return;' +
  '}' +
  'vec3 S=normalize(cross(dFdx(q.xyz),dFdy(q.xyz)));' +
  'vec3 E=vec3(-.25,-.75,.2);' +
  'vec3 N=E-2.0*dot(E,S)*S;' +
  'vec3 t=normalize(vec3(0,0,1));' +
  'float P=20.0;' +
  'vec3 K=r.xyz/r.w;' +
  'float H=0.0;' +
  'float u=0.0;' +
  'for(float M=-3.0;' +
  'M<=3.0;' +
  'M+=1.0){' +
  'for(float L=-3.0;' +
  'L<=3.0;' +
  'L+=1.0){' +
  'if(((texture(h,K.xy+vec2(L,M)/2048.0)).r)<=(K.z*0.99999965)){' +
  'u+=1.0;' +
  '}' +
  'H+=1.0;' +
  '}' +
  '}' +
  'float O=(K.x>=0.0&&K.x<=1.0&&K.y>=0.0&&K.y<=1.0)?1.0-0.5*u/H:1.0;' +
  'vec3 R=mix(vec3(0.0,0.1,0.4),o.rgb,(clamp((0.5+0.5*(max(dot(S,E),0.0))*O)+O*(0.0),0.0,1.0)));' +
  'for(int light=0;' +
  'light<16;' +
  'light++){' +
  'vec3 G=q.xyz-k[light];' +
  'float C=length(G);' +
  'R.rgb+=0.2*max(0.0,dot(normalize(G),S))*(clamp((2.0)/(C*C),0.0,1.0))*j[light];' +
  '}' +
  'e.rgb=R.rgb;' +
  'e.a=1.0;' +
  '}';

const MAIN_VERT =
  GLSL_PREFIX +
  'in vec4 b;' +
  'in vec4 a;' +
  'in mat4 d;' +
  'uniform mat4 l;' +
  'uniform mat4 n;' +
  'uniform mat4 m;' +
  'out vec4 q;' +
  'out vec4 o;' +
  'out float p;' +
  'out vec4 r;' +
  'void main(){' +
  'q=d*b;' +
  'o=a;' +
  'p=-(n*q).z;' +
  'r=m*q;' +
  'gl_Position=l*n*q;' +
  '}';

const POST_FRAG =
  GLSL_PREFIX +
  'uniform sampler2D g;' +
  'uniform sampler2D f;' +
  'in vec2 s;' +
  'out vec4 e;' +
  'void main(){' +
  'vec4 t=texture(f,s);' +
  'e=vec4((texture(g,s)).rgb+2.0*t.a*t.rgb,1);' +
  '}';

const POST_VERT =
  GLSL_PREFIX +
  'in vec2 b;' +
  'in vec2 c;' +
  'out vec2 s;' +
  'void main(){' +
  'gl_Position=vec4(b,0,1);' +
  's=c;' +
  '}';

const SHADOW_FRAG =
  GLSL_PREFIX +
  'out vec4 e;' +
  'void main(){' +
  'e=vec4(1,1,1,1);' +
  '}';

const SHADOW_VERT =
  GLSL_PREFIX +
  'in vec4 b;' +
  'in mat4 d;' +
  'uniform mat4 l;' +
  'uniform mat4 n;' +
  'void main(){' +
  'gl_Position=l*n*d*b;' +
  '}';
