var myEngine = new Engine();
var myTimer = new Timer();		

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback )
		  {
			window.setTimeout(callback, 1000 / 60);
		  };
})();

function Render()
{
	myTimer.OnUpdate();
	if (myEngine.fxLoaded)
		myEngine.Render(myTimer.GetElapsed());
	
	document.getElementById("fps").innerHTML=myTimer.FPS();
	requestAnimFrame(Render);
};

function Init()
{
	//init listeners
	var canvas=document.getElementById("c");
	canvas.addEventListener("mousemove", OnMouseMove, false);
	canvas.addEventListener("mousedown", OnMouseDown, false);
	canvas.addEventListener("mouseup", OnMouseUp, false);
	canvas.addEventListener("mouseup", OnMouseUp, false);
	canvas.onselectstart=new Function ("return false");

	document.getElementById("canvas_width").addEventListener("change",OnCanvasResize,false);
	document.getElementById("canvas_height").addEventListener("change",OnCanvasResize,false);
	
	//load button
	var button = document.getElementById("loadFx");
	button.addEventListener("mouseup", OnLoadFx, false);
	
	//update button
	button = document.getElementById("updateFx");
	button.addEventListener("mouseup", OnUpdateFx, false);			
}

function LoadFx(id)
{
	ShowLoader();
	this.fxLoaded=false;
	debugLn("\r\nLoad fx start");
	
	$.ajaxSetup ({ cache: false });  
	var xmlRequest= $.ajax({
		type: "GET",
		url: "shader/get/"+id,
		dataType: "json",
		cache: false,
		contentType: 'application/json; charset=utf-8',
		success: function(data)
		{
			if (myEngine)
			{
				$("#shader-fs").text(data["shader"]);
				$('#shader-fs').each(function(i, e) {hljs.highlightBlock(e, null, true)});
				
				//loop textures
				for (var i = 0; i < 4; i++)
					if (data.textures)
						if(data.textures[i])
							$("#unit"+i).val(data.textures[i]);

				setTimeout( function() {
					if (CompileFx())
					{
						myEngine.fxLoaded=true;
						debugLn("\r\nLoad fx done");
					}
					else
					{
						debugLn("\r\nError loading fx");
					}		
				HideLoader();
				}
				, 1000 );
			}
		},
		error: function(jqXHR, textStatus) 
		{
			debugLn("\r\nLoad fx error");			
			HideLoader();
		} 
	  });
}

function CompileFx()
{
	//load textures
	for (var i = 0; i < 4; i++)
		myEngine.SetTextures(i, $("#unit"+i).val());
	return myEngine.InitShaders();
}	

function webGLStart()
{
	myEngine.Init();
	Init();

	myEngine.Resize($("#c")[0].width,$("#c")[0].height);
	myEngine.MouseMove($("#c")[0].width/2,$("#c")[0].height/2);
	
	//check if shader's id in query
	var vars = [], hash;
    var q = document.URL.split('?')[1];
    if(q != undefined)
	{
        q = q.split('&');
        for(var i = 0; i < q.length; i++)
		{
            hash = q[i].split('=');
            vars.push(hash[1]);
            vars[hash[0]] = hash[1];
        }
	}
	if (vars['id'])
		LoadFx(vars['id']);
	else
		LoadFx(1);
	Render();
}

function OnLoadFx(event)
{
	LoadFx(myEngine.GetSelectedFx());		
}	

function OnUpdateFx(event)
{
	myEngine.fxLoaded=false;
	debugLn("\r\nLoad fx start");		
	ShowLoader();
	
	
	setTimeout( function() {
		if (!CompileFx())
		{
			debugLn("\r\nError loading fx");	
		}
		else
		{
			myEngine.fxLoaded=true;
			debugLn("\r\nLoad fx done");
		}		
			HideLoader();
		}
		, 1000 );		
}

function OnCanvasResize()
{
	w=$("#canvas_width");
	h=$("#canvas_height");
	c=$("#c")[0];
	
	c.width=Math.min(Math.max(w.val(),32),470);
	c.height=Math.min(Math.max(h.val(),32),470);
	
	w.val(c.width);
	h.val(c.height);
	
	myEngine.Resize(c.width,c.height);
}	

function OnMouseMove(event)
{
	var pos=GetMousePosition(event);
	myEngine.MouseMove(pos.x,pos.y);
	xx=((2.0*pos.x/$("#c")[0].width)-1.0);
	yy=((2.0*pos.y/$("#c")[0].height)-1.0);
	xxx=Math.round(xx*Math.pow(10,2))/Math.pow(10,2)
	yyy=Math.round(yy*Math.pow(10,2))/Math.pow(10,2)						
	$("#mousepos").text(pos.x+"/"+pos.y+"  "+xxx+"/"+yyy);
}	

function OnMouseDown(event)
{
	myEngine.MouseDown();
	var pos=GetMousePosition(event);
	myEngine.MouseMove(pos.x,pos.y);
}

function OnMouseUp(event)
{
	myEngine.MouseUp();
	var pos=GetMousePosition(event);
	myEngine.MouseMove(pos.x,pos.y);
}	

function ShowLoader()
{
	$("body").addClass("loading");
}

function HideLoader()
{
	$("body").removeClass("loading");
}

function debugLn(str) 
{
	document.getElementById("console").innerHTML+=str;	
	document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
}	

function GetMousePosition(event)
{
	var x = new Number();
	var y = new Number();
	var canvas = document.getElementById("c");

	if (event.x != undefined && event.y != undefined)
	{
	  x = event.x;
	  y = event.y;
	}
	else // Firefox method to get the position
	{
	  x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft -317;
	  y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop -32;
	}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	return  {x : x, y : canvas.height-y};
}	

