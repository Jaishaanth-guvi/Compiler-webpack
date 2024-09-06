<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require 'database.php'; // Include your MongoDB connection

if (!isset($client)) {

    require '../../vendor/autoload.php'; // 
    $client = new MongoDB\Client("mongodb://localhost:27017");
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Check if the problem ID is provided
    if (isset($_GET['id'])) {
        $problemId = $_GET['id'];

        try {
            // Access the MongoDB collection
            $collection = $client->Compiler->problems;// Replace 'problems' with your collection name

            // Attempt to delete the document by its ID
            $result = $collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($problemId)]);

            // Check if the document was deleted
            if ($result->getDeletedCount() === 1) {
                // Return success response
                echo json_encode(['status' => 'success', 'message' => 'Problem deleted successfully.']);
            } else {
                // Document was not found, return an error response
                echo json_encode(['status' => 'error', 'message' => 'Problem not found or already deleted.']);
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            // Log the specific MongoDB error
            error_log("MongoDB Exception: " . $e->getMessage());

            // Return error response with the exception message
            echo json_encode(['status' => 'error', 'message' => 'Error deleting problem: ' . $e->getMessage()]);
        } catch (Exception $e) {
            // Log any other general exceptions
            error_log("General Exception: " . $e->getMessage());

            // Return error response with the exception message
            echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . $e->getMessage()]);
        }
    } else {
        // No problem ID provided, return an error response
        echo json_encode(['status' => 'error', 'message' => 'Problem ID is missing.']);
    }
} else {
    // Invalid request method, return an error response
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
