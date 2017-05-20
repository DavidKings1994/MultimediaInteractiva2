<?php
	include "servicios.php";
	$var = new message;
    echo $var->registroAnonimo($_POST["nombre"],$_POST["puntos"]);
?>
