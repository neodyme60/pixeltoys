<html>
<head>
<title>Shader House</title>
<meta name="Keywords" content="">
<meta name="Description" content="">
<meta name="Author" content="">
<script type="text/javascript" src="js/jquery-1.7.2.js"></script>
<script type="text/javascript" src="js/jquery-linedtextarea.js"></script>
<script type="text/javascript" src="js/timer.js"></script>
<script type="text/javascript" src="js/engine.js"></script>
<script type="text/javascript" src="js/highlight/highlight.pack.js"></script>

<link rel="stylesheet" href="css/blueprint/screen.css" type="text/css" media="screen, projection">
<link rel="stylesheet" href="css/blueprint/print.css" type="text/css" media="print">    
<!--[if IE]><link rel="stylesheet" href="css/blueprint/ie.css" type="text/css" media="screen, projection"><![endif]-->
<link rel="stylesheet" href="css/styles.css" type="text/css" />
<link rel="stylesheet" href="css/jquery-linedtextarea.css" type="text/css" media="screen,projection">    
<link rel="stylesheet" href="js/highlight/styles/tomorrow-night-bright.css">

</head>

<body onload="webGLStart()">
<div class="container">
	<div id="header" class="span-24">Shader editor v0.1</div>
	<div class="span-24 bloc_separator"></div>
	
	<div id="left" class="span-12">
		<div class="bloc_content" style="width:470px;height:470px;text-align:center;display:table-cell;vertical-align:middle">
			<canvas id="c" width="470" height="470" style="vertical-align:middle;" onmousedown="this.style.cursor='hand'" onmouseover="this.style.cursor='crosshair'" onmouseup="this.style.cursor='crosshair'">
			If you're seeing this your web browser doesn't support the &lt;canvas>&gt; element. Ouch!
			</canvas>	
		</div>
		
		<div class="bloc_separator"></div>
		
		<div class="bloc_header">&#x25a0;Info</div>
		<div class="bloc_content" style="padding:5px">
			<label>Mouse pos:</label>&nbsp;&nbsp;<span id="mousepos"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label>Fps:</label>&nbsp;&nbsp;<span id="fps"></span>			
		</div>

		<div class="bloc_separator"></div>
		
		<div class="bloc_header">&#x25a0;Size</div>
		<div class="bloc_content" style="padding:5px">
			<label>Width:</label>&nbsp;<input id="canvas_width"  type="text" value="470" style="width:70px" />
			<label>Height:</label>&nbsp;<input id="canvas_height"  type="text" value="470" style="width:70px" />
		</div>
		
		<div class="bloc_separator"></div>		
		
		<div class="bloc_header">&#x25a0;Console</div>
		<div class="bloc_content" style="padding:5px">
			<textarea  id="console" disabled="disabled" class="glsl" style="background-color:#eee;width:100%;resize:none;height:150px;;padding:0;margin:0;border:0">Welcome</textarea>
		</div>		
		
	</div>
	
	<div id="right" class="span-12 last">
		<div class="bloc_header">&#x25a0;Glsl</div>
		<div class="bloc_content">
			<pre contenteditable="true" name="shader-fs" id="shader-fs" class="zlined" style="overflow:scroll;background-color:#eee;resize:none;width:468px;height:470px;padding:0;border:0">			
			</pre>
				
			<textarea id="shader-vs" style="display:none">
			attribute  vec2 vertexPosition;

			void main(void) 
			{
				gl_Position = vec4(vertexPosition.x,vertexPosition.y, 0.0, 1.0);
			}
			</textarea>	
		</div>
		
		<div class="bloc_separator"></div>		
		
		<div class="bloc_header">&#x25a0;Action</div>
		<div class="bloc_content" style="padding:5px">
			<input id="updateFx" type="button" value="Update" style="width:70px" />
		</div>

		<div class="bloc_separator"></div>	
		
		<div class="bloc_header">&#x25a0;Presets</div>
		<div class="bloc_content" style="padding:5px">

			<?php
				$data= $this->get("data");
			?>			
			<select style="width:300px" id="shaders_list">
			<?php			
				foreach ($data as $key=>$value)
				{
			?>
					<optgroup label="<?php echo $value["name"]; ?>">
			<?php
					foreach ($value["shaders"] as $key2=>$value2)
					{
			?>
					<option value="<?php echo $value2["id"]; ?>"><?php echo $value2["name"]; ?></option>
			<?php					
					}
			?>
					</optgroup>				
			<?php					
				}
			?>
			</select>
			<input id="loadFx" type="button" value="Load" style="width:70px" />
		</div>
		
		<div class="bloc_separator"></div>		
		<div class="bloc_header">&#x25a0;Textures</div>
		<div class="bloc_content" style="padding:5px">	
			<label>Unit 0:</label>&nbsp;<input id="unit0" type="text" value="" onclick="" style="width:380px" />
			<br/>
			<label>Unit 1:</label>&nbsp;<input id="unit1" type="text" value="" onclick="" style="width:380px" />
			<br/>
			<label>Unit 2:</label>&nbsp;<input id="unit2" type="text" value="" onclick="" style="width:380px" />
			<br/>
			<label>Unit 3:</label>&nbsp;<input id="unit3" type="text" value="" onclick="" style="width:380px" />
			<br/>
		</div>				
	</div>
	
	<div class="span-24 bloc_separator"></div>
	<div id="footer" class="span-24"></br></div>
</div>
<div class="modal"><!-- Place at bottom of page --></div>
</body>
<script>
$(function() {
	$(".lined").linedtextarea({selectedClass: 'lineselect'});
});

$(document).ready(function() {
//	hljs.initHighlightingOnLoad();
//	$('pre').each(function(i, e) {hljs.highlightBlock(e, null, true)});
});

</script>
<script type="text/javascript" src="js/code.js"></script>
</html>