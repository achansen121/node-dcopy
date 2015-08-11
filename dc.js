
var assert=require("assert");

var type_checker=require("type_checker");


var ontype={};

var copy_obj_rec;

var primitive=function (o,no,k,v) {
  no[k]=v;
  return true;
};


ontype[typeof {}]=function (o,no,k,v,sn,msn) {
  if(v===null)
    return primitive.apply(this,arguments);
  no[k]=copy_obj_rec(v,sn,msn);
  return true;
};
ontype[typeof function(){}]=function (o,no,k,v,sn,msn) {
  return true;
};
ontype[typeof undefined]=primitive;
ontype[typeof 1]=primitive;
ontype[typeof ""]=primitive;
ontype[typeof true]=primitive;

copy_obj_rec=function (o,seen,mycopy) {
  type_checker.object(o);
  type_checker.array(seen);
  type_checker.array(mycopy);
  
  var si=seen.indexOf(o);
  if(si>=0)
    return mycopy[si];
  
  var no;
  if(Array.isArray(o))
    no=[];
  else
    no={};
  
  seen.push(o);
  mycopy.push(no);
  
  Object.keys(o).forEach(function (k) {
    var v=o[k];
    var ts=(typeof o[k]);
    
    assert(ts in ontype);
    ontype[ts](o,no,k,v,seen,mycopy);
  });
  return no;
};

var copy_object=function (o) {
  return copy_obj_rec(o,[],[]);
};


module.exports=copy_object;

