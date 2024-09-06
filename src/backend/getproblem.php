<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json'); 

require "./database.php";

try {
    

    if (!isset($client)) {

    require '../../vendor/autoload.php'; 
    $client = new MongoDB\Client("mongodb://localhost:27017");
}

    $collection = $client->Compiler->problems;

    if (!isset($_GET['id'])) {
        echo json_encode(["status" => "error", "message" => "Problem ID is required."]);
        exit();
    }

    $problemId = $_GET['id'];
    $problem = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($problemId)]);

    if ($problem) {
        $data = json_encode(["status" => "success", "data" => $problem]);
        if ($data === false) {
            throw new Exception(json_last_error_msg());
        }
        echo $data;
    } else {
        echo json_encode(["status" => "error", "message" => "Problem not found."]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Error retrieving problem: " . $e->getMessage()]);
}
?>
