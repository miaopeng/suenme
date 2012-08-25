<?php
define("LF","\r\n");

function write_ini_file($array,$filename) {   
  $ok = "";   
  $s = "";   
  //echo $filename.LF;

  foreach($array as $k=>$v){   
    if(is_array($v)){   
      if($k != $ok)   {   
        $s   .=   LF."[$k]".LF;   
        $ok   =   $k;   
       }   
       $s .= write_ini_file($v,"");   
    }
    else {   
      //if( trim($v) != $v || strstr($v,"[") ) 
      $v = "\"$v\"";   
      $s .= "$k = $v".LF;   
    }   
  }

  //echo $s;
    
  if(!is_writable($filename))   
      echo "~can not access file~";
  else {
      $fp = fopen($filename,"w");
      fwrite($fp,$s);   
      fclose($fp);  
  }
}

function replaces($str){
	$str = str_replace("\"", "", $str);
	$str = str_replace("'", "\"", $str);
	return $str;
}

$editors = array("fifichat","AA","失控的偏执狂","歪歪","haniel","mios","Miss Echo","小双","viino","睡中猛的一哆嗦","Jobson","大脸猫","何小沁","木西","小晨");
$authors = array(null,null,null,"艾小柯(澳)","图宾根木匠","李洋(法)","黄文杰","小韩0221","本南丹蒂","北太西","黄小邪(美)","谋杀电视机","magasa","东遇西","HERMINA","雪风","妖灵妖","杜政轩(英)","杨北辰(法)","赵静","Cogito(法)","赵捷","Luc","卫西谛","木卫二","前海一支剑","howie","肥内(台)","shaun","梁文(英)","罗展凤(港)");

//$file = fopen("cfg.ini","r");
//$size = filesize("cfg.ini");
//echo fread($file, $size);

$cfg = parse_ini_file("cfg.ini");

$selected = replaces($cfg["selected"]);
$selected = unserialize($selected);

$complete = replaces($cfg["complete"]);
$complete = unserialize($complete);

$tuanslate = replaces($cfg["tuanslate"]);
$tuanslate = unserialize($tuanslate);

$tech = replaces($cfg["tech"]);
$tech = unserialize($tech);

if ( !is_array($selected) ){
	$selected = array();
}

if(isset($_POST["editor"]) && !in_array($_POST["editor"], $complete)){

	if ($_POST["team"]=="1" && isset($_POST["author"]) ){
		$selected = array_merge($selected, $_POST["author"]);
		$complete[] = $_POST["editor"];
		$cfg["selected"] = str_replace("\"", "'", serialize($selected));
		$cfg["complete"] = str_replace("\"", "'", serialize($complete));
		$cfg[$_POST["editor"]] = str_replace("\"", "'", serialize($_POST["author"]));
		write_ini_file($cfg, "cfg.ini"); 
	}

	if ($_POST["team"]=="2"){
		$tuanslate[] = $_POST["editor"];
		$cfg["tuanslate"] = str_replace("\"", "'", serialize($tuanslate));
		$complete[] = $_POST["editor"];
		$cfg["complete"] = str_replace("\"", "'", serialize($complete));
		write_ini_file($cfg, "cfg.ini"); 
	}


	if ($_POST["team"]=="3"){
		$tech[] = $_POST["editor"];
		$cfg["tech"] = str_replace("\"", "'", serialize($tech));
		$complete[] = $_POST["editor"];
		$cfg["complete"] = str_replace("\"", "'", serialize($complete));
		write_ini_file($cfg, "cfg.ini"); 
	}
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>阅后即焚</title>
<style>
#header { padding:5px;border-bottom:1px solid #333;font-size:15px}
.authors { height:150px}
.authors span { display:inline-block;width:200px;float:left}
.authors .selected { color:#ccc}
.member { margin-left:30px}
</style>
<script>
function $(n){ return document.getElementById(n);}
function clear(){
	$('select').style.display='none';
}
function joinTeam(v){
	switch (v) {
   		case 1 :
   			$('select').style.display='';
			$('team').value = 1;
   			break;
   		case 2 :
   			clear();
   			
       		if(confirm($('editor').value+" : 您确定要加入文章翻译组,维护世界和平吗？")){
       			$('team').value = 2;
       			$('frm').submit();
       		}
       		break;
   		case 3 :  			
   			clear();
       		if(confirm($('editor').value+" : 您确定要加入技术支持组，成为下一个卡没聋吗？")){
       			$('team').value = 3;
       			$('frm').submit();
       		}
	} 


}
</script>
</head>
<body>
<form id="frm" method="post">
<input id="team" type="hidden" name="team" value=""/>
<div id="header">Cinephilia.net 组员工作内容分配</div>
<div>
	<h3>请选择您的身份, 诚也勿扰:
	<select id="editor" name="editor">
		<?php
		foreach ($editors as $v) {
			if(in_array($v, $complete)) continue;
			echo "<option value=\"".$v."\">".$v."</option>";
		}
		?>
	</select>
	</h3>
</div>
<div>
	<input type="button" value="加入资讯报道组" onclick="joinTeam(1)"/>
	<input type="button" value="加入翻译组" onclick="joinTeam(2)"/>
	<input type="button" value="加入技术组" onclick="joinTeam(3)"/>
</div>
<div id="select" style="display:none">
	<h3>选择您要认领的影评人,每人负责管理三名:</h3>
	<div class="authors">
	<?php
	foreach($authors as $k=>$v){
		if($v){
			$isChecked = in_array($k, $selected);
			$disabled = $isChecked ? " disabled=true" : "";
			$cls = $isChecked ? " class=\"selected\"" : "";
			echo "<span".$cls."><input type=\"checkbox\" name=\"author[]\" value=\"".$k."\"".$disabled."/>".$v."</span>\r";
		}
	}	
	?>
	</div>
	<input type="button" value="确认领取" onclick="javascript:if(confirm($('editor').value+' : 您确定加入此组，并认领这些可怜的影评人吗？')){this.form.submit();}"/>
</div>
<div>
	<h3>已认领的人员:</h3>
	<h4>技术支持组:</h4>
		<div class="member"><?php foreach($tech as $v){ echo $v."; ";	} ?></div>
	<h4>文章翻译组:</h4>
		<div class="member"><?php foreach($tuanslate as $v){ echo $v."; ";	} ?></div>
	<h4>咨询报道组：</h4>
	<div class="member">
	<?php
	foreach($cfg as $k=>$v){
		if($k == "selected" || $k == "complete" || $k == "tuanslate" || $k == "tech") continue;
		echo "$k : ";
		$v2 = replaces($v);
		$v2 = unserialize($v2);
		foreach($v2 as $v3){
			echo $authors[$v3]."; ";		
		}
		//echo join(",", $v2);
		echo "<br />";
	}	
	?>

	</div>
</div>
</form>
</body>
</html>

