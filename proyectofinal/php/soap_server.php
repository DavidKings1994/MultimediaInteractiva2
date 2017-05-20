<?php
	ini_set('display_errors', 'off');
	$GLOBALS['HTTP_RAW_POST_DATA'] = file_get_contents ('php://input');
	$HTTP_RAW_POST_DATA = $GLOBALS['HTTP_RAW_POST_DATA'];

	require_once('./../vendor/deviservi/nusoap/lib/nusoap.php');

	ini_set("soap.wsdl_cache_enabled", "0");
	$URL = "http://lmad.davidreyes.tk/proyectofinal//php/soap_server.php";
	$namespace = $URL.'?wsdl';

	function connect() {
		$link = mysqli_connect('pdb6.awardspace.net', '1079747_usuarios', 'jjkli8jlkjlu', '1079747_usuarios')
	    	or die('No se pudo conectar: ' . mysql_error());
	    	return $link;
	}

	$server = new nusoap_server;
	$server->configureWSDL('server', "urn:server");
	$server->wsdl->schemaTargetNamespace = "urn:server";

	$server->register('get_message',array("name" => "xsd:string"),array("return" => "xsd:string"),"urn:server","urn:server#get_message",'rpc','encoded','Just say hello');
	$server->register('registro',array("nombre" => "xsd:string", "puntos" => "xsd:string", "idPuntuacion" => "xsd:string", "urlFoto" => "xsd:string"),array("return" => "xsd:string"),"urn:server","urn:server#registro",'rpc','encoded','registra puntuaciones');
	$server->register('registroAnonimo',array("nombre" => "xsd:string", "puntos" => "xsd:string"),array("return" => "xsd:string"),"urn:server","urn:server#registroAnonimo",'rpc','encoded','registra puntuaciones sin sesion de facebook');
	$server->register('leaderBoard',array(),array("return" => "xsd:string"),"urn:server","urn:server#leaderBoard",'rpc','encoded','todos los datos');

	function get_message($name) {
		if(!isset($name)) {
			return new soap_fault('Client','','Put Your Name!');
		}
		$result = "Welcome to ".$name.". Thanks for Your First Web Service Using PHP with SOAP";
		return $result;
	}

	function registro($nombre, $puntos, $idPuntuacion, $urlFoto) {
		$link = connect();
		$query = mysqli_prepare($link, "CALL resgistrarPuntuacion(?,?,?,?);");
		$query->bind_param('siss', $nombre, $puntos, $idPuntuacion, $urlFoto);
		$query->execute();
		$query->bind_result($resul);
		if($query->fetch()) {
			$r = array('resultado' => $resul);
			return json_encode($r);
		} else {
			$error = array('resultado' => $query->error);
			return json_encode($error);
		}
	}

	function registroAnonimo($nombre, $puntos) {
		$link = connect();
		$query = mysqli_prepare($link, "CALL RegistrarAnonimo(?,?);");
		$query->bind_param('si', $nombre, $puntos);
		$query->execute();
		$query->bind_result($resul);
		if($query->fetch()) {
			$r = array('resultado' => $resul);
			return json_encode($r);
		} else {
			$error = array('resultado' => $query->error);
			return json_encode($error);
		}
	}

	function leaderBoard() {
		$link = connect();
		$resul = mysqli_query($link, "CALL mostrarPuntuaciones();");
		$row = array();
		while($r = mysqli_fetch_assoc($resul)) {
			$row[] = $r;
		}
		return json_encode($row);
	}

	$server->service($HTTP_RAW_POST_DATA);
	exit();
?>
