<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Ensure error reporting does not interfere with JSON response
error_reporting(0);
ini_set('display_errors', 0);

require 'database.php'; // Include your MongoDB connection

if (!isset($client)) {

    require '../../vendor/autoload.php'; // 
    $client = new MongoDB\Client("mongodb://localhost:27017");
}


$collection = $client->Compiler->problems;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight requests
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'], $data['title'], $data['description'], $data['samples'], $data['hiddenTestCases'])) {
    $id = $data['id'];
    $title = $data['title'];
    $description = $data['description'];
    $samples = $data['samples'];
    $hiddenTestCases = $data['hiddenTestCases'];

    try {
        $result = $collection->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($id)],
            ['$set' => [
                'title' => $title,
                'description' => $description,
                'samples' => $samples,
                'hiddenTestCases' => $hiddenTestCases
            ]]
        );

        if ($result->getModifiedCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Problem updated successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No changes were made.']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data.']);
}
?>
