<?php


header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'database.php'; // Include your MongoDB connection

if (!isset($client)) {

    require '../../vendor/autoload.php'; // 
    $client = new MongoDB\Client("mongodb://localhost:27017");
}


$collection = $client->Compiler->problems;

try {
    
    $totalDocuments = $collection->countDocuments();
    
    if ($totalDocuments > 0) {
        
        $randomSkip = rand(0, $totalDocuments - 1);
        
        
        $cursor = $collection->find([], [
            'limit' => 1,
            'skip' => $randomSkip
        ]);
        
        $problem = null;
        foreach ($cursor as $document) {
            $problem = [
                '_id' => (string) $document['_id'],
                'title' => $document['title'],
                'description' => $document['description'],
                'sample' => $document['samples'] ?? [],
                'hiddenTestCases' => $document['hiddenTestCases'] ?? [],
            ];
        }
        ob_end_clean();
        
        echo json_encode($problem);
    } else {
        echo json_encode(['message' => 'No problems found in the database.']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
