<?php
	include "servicios.php";
	$var = new message;
    echo $var->registro($_POST["nombre"],$_POST["puntos"],$_POST["idPuntuacion"],$_POST["urlFoto"]);
?>
