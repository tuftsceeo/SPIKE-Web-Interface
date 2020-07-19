var client = require('./index');
var c= client(require('./apikey.js'))

var did = "12ae4e8452feed57f993bda3"
var wid = "bbe3cde5759d1f0c7b2a6f0f"
var eid = "866bf4cbbb1497e5cad582c5";

global.occ={};
global.occLength=0;
global.mates={};


var cos=function(angle){
	var angle=angle.toFixed(3)
	return (Math.cos(Math.PI*angle/180))  // return the cosine of angle after converting to radian
};
var sin=function(angle){
	var angle=angle.toFixed(3)
	return (Math.sin(Math.PI*angle/180))  //similar
};

var invcos=function(angle){
	var angle=angle.toFixed(3)
	return (Math.acos(angle)*180/Math.PI) //''
};
var invsin=function(angle){
	var angle=angle.toFixed(3)
	return (Math.asin(angle)*180/Math.PI) //''
};

var fbfmultiply=function(A,B){ //4X4 matrix multiplication - inputs are two  16 element arrays
	var AM=tomatrix(A);
	var BM=tomatrix(B);
	var PM=BM;
		for(var i=0;i<4;i=i+1)
	{
		for (var j=0;j<4;j=j+1){
			var temp=0;
			for (var k=0;k<4;k=k+1){ 
				temp+=AM[i][k]*BM[k][j];
			}
			PM[i][j]=temp
		}
	}
	var P=toArray(PM);
	return PM; //return array 
}

var tomatrix=function(A){   // change array to matrix
	var AM=[];
	var k=0;
	for (var i=0;i<4;i=i+1){
		
		var temp=[];
		for(var j=0;j<4;j=j+1, k=k+1){
			temp[j]=A[k];
			
		}
		AM.push(temp)

	}
return(AM)
}
var toArray=function(AM){ 			// change matrix to array
	var A=[];
	var k=0;
	for (var i=0;i<4;i=i+1){
		for(var j=0;j<4;j=j+1, k=k+1){
			A[k]=AM[i][j]
		}
	}
	return A;
}

var Transform= function(x,y,z,angle,tx=0,ty=0,tz=0){ //function that creates a Transformation matrix based on vector xyz and angle

	var ux= x/ Math.sqrt(x*x  + y*y +z*z); 
	var uy= y/ Math.sqrt(x*x  + y*y +z*z);
	var uz= z/ Math.sqrt(x*x  + y*y +z*z);

	var sc= sin(angle/2)*cos(angle/2);
	var sq= sin(angle/2)*sin(angle/2);
	var Transform= [ 1-2*(uy*uy + uz*uz)* sq 	, 2* (ux*uy*sq -uz * sc )	, 2* (ux*uz*sq + uy*sc)		, tx ,
					 2* (ux*uy*sq + uz*sc)		, 1-2*(ux*ux + uz*uz)* sq 	, 2* (uy*uz*sq - ux*sc)		, ty ,
					 2* (ux*uz*sq - uy*sc) 		, 2* (uy*uz*sq + ux*sc)		, 1-2*(ux*ux + uy*uy)* sq 	, tz ,
					 0							,	0						,	0						, 1	]	
	return Transform
};

/*
var setoccurrences=function(response){
	var occurrences=response.rootAssembly.occurrences;
	occLength=0;
    for (var i=0;i < occurrences.length ; i=i+1){    //how many parts are there?
    	occLength++;
    	var a=(occurrences[i].transform[9]+occurrences[i].transform[6]);	//T21+T12
    	var b= (occurrences[i].transform[8]+occurrences[i].transform[2]);//T20+T02
    	var c=(occurrences[i].transform[4]+occurrences[i].transform[1]);    //T10+T01
    	var tx=occurrences[i].transform[3];							// hope this is x translation , couldbe origin
    	var ty=occurrences[i].transform[7];								// y
    	var tz=occurrences[i].transform[11];	
    	var ytemp=a/b;	
    	var ztemp=a/c;					// working out the vectors T21+T12/(T20+T02)
    								//similar

    	var den=Math.sqrt(ytemp*ytemp+ztemp*ztemp+1);		// to calculate the sq
    	var ux=1/den;										// unit vector
    	var uy=ytemp/den;
    	var uz=ztemp/den;

    	var sqtemp=a/(4*uy*uz);	//sq
    	var alphatemp= 2*invsin(Math.sqrt(sqtemp))			//angle of rotation around the unit vector
    	occ[i]={
    		'path': occurrences[i].path[0],				//name of the part
    		'matrix': occurrences[i].transform,			//tx matrix
    		'x': 1,								//vector-x
    		'y':ytemp,							//vector-y
    		'z':ztemp,							//vector-z
    		'sq': sqtemp,						//sq
    		'alpha':alphatemp,					//angle
    		'ux':ux,							//unitvector
    		'uy':uy,							//''	
    		'uz':uz,
    		'tx':tx,							//could be origin
    		'ty':ty,
    		'tz':tz,	
    		'name':'blank'
    	} 
	}

	var ins=response.rootAssembly.instances;
	for (var i=0;i<ins.length;i=i+1){
		for(var j=0;j<occurrences.length;j=j+1){
			if(occ[j].path==ins[i].id){
				occ[j].name=ins[i].name;
			}
		}
	}

    var fea=response.rootAssembly.features;
    for (var i=0;i < fea.length; i=i+1){
    	var Ent= fea[i].featureData.matedEntities;
    	for (var j=0; j< Ent.length ; j=j+1){
    		var mateName= Ent[j].matedOccurrence[0]
    		for(var k=0;k<occurrences.length;k=k+1){
				if(occ[k].path==mateName){
					occ[k].mateOriginX= Ent[j].matedCS.origin[0];			//save the origin and
					occ[k].mateOriginY= Ent[j].matedCS.origin[1];
					occ[k].mateOriginZ= Ent[j].matedCS.origin[2];

					occ[k].xAxis=Ent[j].matedCS.xAxis;
					occ[k].yAxis=Ent[j].matedCS.yAxis;
					occ[k].zAxis=Ent[j].matedCS.zAxis;
    			}
    		}
    	}
    }
    return {occ,occLength};
}
*/
var setoccurrences=function(response){
	var occurrences=response.rootAssembly.occurrences;
	occLength=0;
    for (var i=0;i < occurrences.length ; i=i+1){    //how many parts are there?
    	occLength++;
    	var M00=occurrences[i].transform[0]
    	var M01=occurrences[i].transform[1]
    	var M02=occurrences[i].transform[2]
    	var tx=occurrences[i].transform[3]
    	var M10=occurrences[i].transform[4]
    	var M11=occurrences[i].transform[5]
    	var M12=occurrences[i].transform[6]
    	var ty=occurrences[i].transform[7]
    	var M20=occurrences[i].transform[8]
    	var M21=occurrences[i].transform[9]
    	var M22=occurrences[i].transform[10]
    	var tz=occurrences[i].transform[11]
    	var M30=occurrences[i].transform[12]
    	var M31=occurrences[i].transform[13]
    	var M32=occurrences[i].transform[14]
    	var M33=occurrences[i].transform[15]


    	var alpha=1/2 * invcos(1-((M21-M12)*(M21-M12) + (M02-M20)*(M02-M20) + (M10-M01)*(M10-M01))/2);
    	var sc=sin(alpha/2)*cos(alpha/2);
    	var sq=sin(1/2 * invsin(2*sc))*sin(1/2 * invsin(2*sc));
    	var x= (M21-M12)/(4*sc)	//T21+T12
    	var y= (M02-M20)/(4*sc)
    	var z= (M10-M01)/(4*sc)
    				// working out the vectors T21+T12/(T20+T02)
    								//similar

    	
    	occ[i]={
    		'path': occurrences[i].path[0],				
    		'matrix': occurrences[i].transform,			
    		'x': x,								
    		'y': y,							
    		'z': z,							
    		'sq': sq,						
    		'alpha':alpha,			
    		'tx':tx,							
    		'ty':ty,
    		'tz':tz,	
    		'name':'blank'
		}

	}

	var ins=response.rootAssembly.instances;
	for (var i=0;i<ins.length;i=i+1){
		for(var j=0;j<occurrences.length;j=j+1){
			if(occ[j].path==ins[i].id){
				occ[j].name=ins[i].name;
			}
		}
	}

    var fea=response.rootAssembly.features;
    for (var i=0;i < fea.length; i=i+1){
    	var Ent= fea[i].featureData.matedEntities;
    	for (var j=0; j< Ent.length ; j=j+1){
    		var mateName= Ent[j].matedOccurrence[0]
    		for(var k=0;k<occurrences.length;k=k+1){
				if(occ[k].path==mateName){
					occ[k].mateOriginX= Ent[j].matedCS.origin[0];			//save the origin and
					occ[k].mateOriginY= Ent[j].matedCS.origin[1];
					occ[k].mateOriginZ= Ent[j].matedCS.origin[2];

					occ[k].xAxis=Ent[j].matedCS.xAxis;
					occ[k].yAxis=Ent[j].matedCS.yAxis;
					occ[k].zAxis=Ent[j].matedCS.zAxis;
    			}
    		}
    	}
    }
    return {occ,occLength};
}




c.assemblyDefinition(did,wid,eid, function (data) {
        var response = JSON.parse(data);
        var O=setoccurrences(response); 
        console.log(O)
        var part=null;
		var rotatepart ='Motor Axle <1>';
        var rotateangle=90;
        var x=null;
        var y=null;
        var z=null;
        var angle=null;
        var tx=null;
        var ty=null;
        var tz=null;
        var mateOriginX=null;
        var mateOriginY=null;
        var mateOriginZ=null;

        for(var i=0;i<O.occLength;i++){

        	if(O.occ[i].name==rotatepart){
        		path=O.occ[i].path;
        		x= O.occ[i].x;
			    y= O.occ[i].y;
			    z= O.occ[i].z;
			    alpha=O.occ[i].alpha;
			    break;
			}
		}

        c.occurrenceTransforms(did,wid,eid,Transform(x,y,z,-alpha,0,0,0) ,path,true, function (data) {
        	c.assemblyDefinition(did,wid,eid, function (data) {
	        	var response = JSON.parse(data);
	        	var O=setoccurrences(response); 
				for(var i=0;i<O.occLength;i++){
				    if(O.occ[i].name==rotatepart){
				        tx=O.occ[i].tx;
					    ty=O.occ[i].ty;
					    tz=O.occ[i].tz;
					   
					    mateOriginX=O.occ[i].mateOriginX;
					    mateOriginY=O.occ[i].mateOriginY;
					    mateOriginZ=O.occ[i].mateOriginZ;
					    //xAxis=O.occ[i].xAxis;
					    //yAxis=O.occ[i].yAxis;
					    //zAxis=O.occ[i].zAxis;
		        		break;
		        		}
		        	}
        		c.occurrenceTransforms(did,wid,eid,Transform(1,0,0,0,-tx-mateOriginX,-ty-mateOriginY,-tz-mateOriginZ) ,path,true, function (data) {


        			 c.occurrenceTransforms(did,wid,eid,Transform(0,0,1,rotateangle,0,0,0) ,path,true, function (data) {})
        		});
        		
        		});
       })

     
        //var response = JSON.parse(data);
    });



//    });




    








/*[[ 1, 0, 0, 0 ],[ 0, 0.8660, -0.5, 0],[0, 0.433, 0.616, 0 ],[ 0, 0, 0, 1 ]]
console.log(fbfmultiply(Transform(1,0,0,30,0,0,0),Transform(1,0,0,0,-mx,-my,-mz)))
c.occurrenceTransforms(did,wid,eid,fbfmultiply(Transform(1,0,0,30,0,0,0),Transform(0,0,1,0,-mx,-my,-mz)) ,part11,true, function (data) {
        var response = JSON.parse(data);
 		//console.log("aa aassdfadfasdf",aa,bb,cc)
		//console.log(response)
        //console.log('Fetched ' + response + ' documents.');
    });
/*



/*
c.assemblyDefinition(did,wid,eid, function (data) {
        var response = JSON.parse(data);
        var occ=response.rootAssembly.occurrences
        var occurrences={};

        for (var i=0;i < occ.length ; i=i+1){                  //how many parts are there?
        	var a=(occ[i].transform[9]+occ[i].transform[6]);	//T21+T12
        	var b= (occ[i].transform[8]+occ[i].transform[2]);	//T20+T02
        	var c=(occ[i].transform[4]+occ[i].transform[1]);    //T10+T01
        	var tx=occ[i].transform[3];							// hope this is x translation , couldbe origin
        	var ty=occ[i].transform[7];								// y
        	var tz=occ[i].transform[11];						//z
        	var ytemp=a/b;										// working out the vectors T21+T12/(T20+T02)
        	var ztemp=a/c;										//similar
        	
        	var den=Math.sqrt(ytemp*ytemp+ztemp*ztemp+1);		// to calculate the sq
        	var ux=1/den;										// unit vector
        	var uy=ytemp/den;
        	var uz=ztemp/den;

        	var sqtemp=a/(4*uy*uz);								//sq

        	var alphatemp= 2*invsin(Math.sqrt(sqtemp))			//angle of rotation around the unit vector
        	occurrences[i]={
        		'path': occ[i].path[0],				//name of the part
        		'matrix': occ[i].transform,			//tx matrix
        		'x': 1,								//vector-x
        		'y':ytemp,							//vector-y
        		'z':ztemp,							//vector-z
        		'sq': sqtemp,						//sq
        		'alpha':alphatemp,					//angle
        		'ux':ux,							//unitvector
        		'uy':uy,							//''	
        		'uz':uz,
        		'tx':tx,							//could be origin
        		'ty':ty,
        		'tz':tz	
        	}
        
    	}


    	var MateInfo={}
        var fea=response.rootAssembly.features 		
        for (var i=0; i < 1 ; i=i+1){
        //for (var i=0; i < fea.length ; i=i+1){								//how many mates
         	var Ent= fea[i].featureData.matedEntities;						//how many parts the mate has
        	for (var j=0; j< Ent.length ; j=j+1){			
        		var mateName= Ent[j].matedOccurrence[0]						//to compare the names
        		for (var z=0;z < occ.length ; z=z+1){	
        				if(occurrences[z].path==mateName){					//if part name is in the mate feature list
        					var originx= Ent[j].matedCS.origin[0];			//save the origin and
        					var originy= Ent[j].matedCS.origin[1];
        					var originz= Ent[j].matedCS.origin[2];
        					//var newox= vectorx* Ent[j].matedCS.xAxis[0] + vectory* Ent[j].matedCS.xAxis[1] + vectorz * Ent[j].matedCS.xAxis[2],
        					///var newoy= vectory* Ent[j].matedCS.yAxis[0] + vectory* Ent[j].matedCS.yAxis[1] + vectorz * Ent[j].matedCS.yAxis[2],
        					//var newoz= vectorz* Ent[j].matedCS.zAxis[0] + vectory* Ent[j].matedCS.zAxis[1] + vectorz * Ent[j].matedCS.zAxis[2],
        					var vectorx= occurrences[z].ux;//tx+originx;
        					var vectory= occurrences[z].uy;//ty+originy;
        					var vectorz= occurrences[z].uz;//tz+originz;
        					//console.log(originx,originy,originz,"dfadfa",vectorx,vectory,vectorz,"dddddd",occurrences[z].tx,occurrences[z].ty,occurrences[z].tz,"dfadfa")
        					MateInfo[j]={
        					'name':mateName,
        					'originx': originx,
        					'originy': originy,
        					'originz': originz,
        					'vectorx':vectorx* Ent[j].matedCS.xAxis[0] + vectory* Ent[j].matedCS.xAxis[1] + vectorz * Ent[j].matedCS.xAxis[2],
        					'vectory':vectorx* Ent[j].matedCS.yAxis[0] + vectory* Ent[j].matedCS.yAxis[1] + vectorz * Ent[j].matedCS.yAxis[2],
        					'vectorz':vectorx* Ent[j].matedCS.zAxis[0] + vectory* Ent[j].matedCS.zAxis[1] + vectorz * Ent[j].matedCS.zAxis[2],

	       					}
        				}	
        			}
        		}
        	}
  console.log(data)
  console.log("dfadfa",MateInfo)

/*
aa=MateInfo[1].vectorx;
bb=MateInfo[1].vectory;
cc=MateInfo[1].vectorz;

setvar(MateInfo[1].vectorx,MateInfo[1].vectory,MateInfo[1].vectorz)

					
});		




*/
/*

c.assemblyDefinition(did,wid,eid, function (data) {
        var response = JSON.parse(data);
        var occ=response.rootAssembly.occurrences
        var occurrences={};
        var occurrences1={};
        for (var i=0;i < occ.length ; i=i+1){
        	occurrences[i]={
        		'path': occ[i].path[0],
        		'matrix': occ[i].transform,
        		'beta': invsin(occ[i].transform[8]).toFixed(3),
        		'gamma':invsin((occ[i].transform[9]/cos(invsin(occ[i].transform[8])))).toFixed(3),
        		'alpha':invcos((occ[i].transform[4]/cos(invsin(occ[i].transform[8])))).toFixed(3),
        		
        	}
        	

        };

        var MateInfo={}
        var fea=response.rootAssembly.features
        for (var i=0; i < fea.length ; i=i+1){
         	var Ent= fea[i].featureData.matedEntities;
        	for (var j=0; j< Ent.length ; j=j+1){
        		var mateName= Ent[j].matedOccurrence[0]
        		for (var z=0;z < occ.length ; z=z+1){
        				if(occurrences[z].path==mateName){
        					MateInfo[j]={
        					'name':mateName,
        					'al':occurrences[z].alpha,
        					'be':occurrences[z].beta,
        					'ga':occurrences[z].gamma,
        					'realalpha':occurrences[z].alpha * Ent[j].matedCS.xAxis[0] + occurrences[z].beta * Ent[j].matedCS.xAxis[1] + occurrences[z].gamma * Ent[j].matedCS.xAxis[2],
        					'realbeta' :occurrences[z].alpha  * Ent[j].matedCS.yAxis[0] + occurrences[z].beta  * Ent[j].matedCS.yAxis[1] + occurrences[z].gamma  * Ent[j].matedCS.yAxis[2],
        					'realgamma':occurrences[z].alpha * Ent[j].matedCS.zAxis[0] + occurrences[z].beta * Ent[j].matedCS.zAxis[1] + occurrences[z].gamma * Ent[j].matedCS.zAxis[2]        				
        				}
        				}	
        			}
        		}
        	}
console.log(data)	
console.log(MateInfo[1].name,"alpha",MateInfo[1].realalpha,MateInfo[0].realalpha,MateInfo[1].al,MateInfo[0].al)
console.log(MateInfo[1].name,"beta",MateInfo[1].realbeta,MateInfo[0].realbeta,MateInfo[1].be,MateInfo[0].be)
console.log(MateInfo[1].name,"gamma",MateInfo[1].realgamma,MateInfo[0].realgamma,MateInfo[1].ga,MateInfo[0].ga)


        });
*/


		
/*
console.log("##outside ##########")
console.log(aa,bb,cc)

console.log("############")
c.occurrenceTransforms(did,wid,eid,Transform(-0.5112485407542078,-0.15446565021245126 ,0.3594074816213023,120,0,0,0) ,"M0ROky0N4pM6FX6T1", function (data) {
        var response = JSON.parse(data);
 
console.log(response)
        //console.log('Fetched ' + response + ' documents.');
    });
									





c.assemblyDefinition(did,wid,eid, function (data) {
        var response = JSON.parse(data);
        var occ=response.rootAssembly.occurrences
        var occurrences={};
        var occurrences1={};
        for (var i=0;i < occ.length ; i=i+1){
        	occurrences[i]={
        		'path': occ[i].path[0],
        		'matrix': occ[i].transform,
        		'beta': invsin(occ[i].transform[8]).toFixed(3),
        		'gamma':invsin((occ[i].transform[9]/cos(invsin(occ[i].transform[8])))).toFixed(3),
        		'alpha':invcos((occ[i].transform[4]/cos(invsin(occ[i].transform[8])))).toFixed(3),
        		
        	}
        	

        };

        var MateInfo={}
        var fea=response.rootAssembly.features
        for (var i=0; i < fea.length ; i=i+1){
         	var Ent= fea[i].featureData.matedEntities;
        	for (var j=0; j< Ent.length ; j=j+1){
        		var mateName= Ent[j].matedOccurrence[0]
        		for (var z=0;z < occ.length ; z=z+1){
        				if(occurrences[z].path==mateName){
        					MateInfo[j]={
        					'name':mateName,
        					'realalpha':occurrences[z].alpha * Ent[j].matedCS.xAxis[0] + occurrences[z].alpha * Ent[j].matedCS.xAxis[1] + occurrences[z].alpha * Ent[j].matedCS.xAxis[2],
        					'realbeta' :occurrences[z].beta  * Ent[j].matedCS.yAxis[0] + occurrences[z].beta  * Ent[j].matedCS.yAxis[1] + occurrences[z].beta  * Ent[j].matedCS.yAxis[2],
        					'realgamma':occurrences[z].gamma * Ent[j].matedCS.zAxis[0] + occurrences[z].gamma * Ent[j].matedCS.zAxis[1] + occurrences[z].gamma * Ent[j].matedCS.zAxis[2]        				
        				}
        				}	
        			}
        		}
        	};
console.log(data)	
console.log(MateInfo[1].name,"alpha",MateInfo[1].realalpha -MateInfo[0].realalpha)
console.log(MateInfo[1].name,"beta",MateInfo[1].realbeta-MateInfo[0].realbeta)
console.log(MateInfo[1].name,"gamma",MateInfo[1].realgamma-MateInfo[0].realgamma)

 })
        		
        /*for (var i=0; i < occ.length ; i=i+1){
     
        	for (var j=0; j < occ.length ; j=j+1){
               	console.log(i,j,"alpha",occurrences[i].realalpha,occurrences[j].realalpha,occurrences[i].realalpha-occurrences[j].realalpha)
        		console.log(i,j,"beta",occurrences[i].realbeta-occurrences[j].realbeta)
        		console.log(i,j,"gamma",occurrences[i].realgamma-occurrences[j].realgamma)
        	}
        }*/
 
        //features[i].featuredata.matedEntities.[j].matedOccurrence[0]--- pathname compare..

       // occurrences[whatever matches].origin=fea[i].featuredata.matedEntities.[j].matedCS.xAxis

   

 //       for (var j=0;j<response.rootAssembly.occurrences.length;j=j+1){

   //     	console.log(invsin(occurrences[j].matrix[9]))
   //     occurrences1[j]=
   //     {'beta':invsin(occurrences[j].matrix[9])
        //'gamma':invsin(occurrences[j].matrix[10]/cos(occurrences[j].beta)),
        //'alpha':invcos(occurrences[j].matrix[5]/cos(occurrences[j].beta))
       
       // }
        //console.log("beta",occurrences1[j].beta)





/*
c.getDocuments({}, function (data) {
        var response = JSON.parse(data);
        console.log('Fetched ' + response + ' documents.');
    });
 c.createPartStudio(did,wid,name, function (data) {
        var response = JSON.parse(data);
        console.log('Fetched ' + response + ' documents.');
    });
 
*/

