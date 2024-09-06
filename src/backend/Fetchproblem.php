<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include "./database.php";

// Ensure $client is defined and properly initialized
if (!isset($client)) {

    require '../../vendor/autoload.php'; // 
    $client = new MongoDB\Client("mongodb://localhost:27017");
}

// Ensure the database and collection names are correct
$collection = $client->Compiler->problems;

try {
    $cursor = $collection->find();

    // Prepare an array to store problems
    $problems = [];

    // Loop through each document and add to problems array
    foreach ($cursor as $document) {
        $problems[] = [
            '_id' => (string) $document['_id'],
            'title' => $document['title'],
            'description' => $document['description'],
        ];
    }

    // Output the JSON-encoded array
    echo json_encode($problems);
} catch (Exception $e) {
    // Return a JSON-encoded error message
    echo json_encode(['error' => $e->getMessage()]);
}
?>
