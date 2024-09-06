<?php

ob_start();


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if (!isset($client)) {

    require '../../vendor/autoload.php'; // 
    $client = new MongoDB\Client("mongodb://localhost:27017");
}

// Function to send JSON response
function sendJsonResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
}

try {
    // Include database connection
    require_once 'database.php';

    // Get MongoDB client
    $client = getMongoDBClient();
    $collection = $client->Compiler->problems;

    // Get the posted data
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (!$inputData) {
        throw new Exception("No data received or invalid JSON");
    }

    $errors = [];

    // Validate required fields
    if (empty($inputData['title'])) {
        $errors[] = "Problem title is required.";
    }

    if (empty($inputData['description'])) {
        $errors[] = "Description is required.";
    }

    // Validate sample I/O fields
    if (empty($inputData['samples']) || !array_filter($inputData['samples'], fn($sample) => $sample['enabled'])) {
        $errors[] = "At least one enabled sample input/output is required.";
    } else {
        foreach ($inputData['samples'] as $index => $sample) {
            if ($sample['enabled']) {
                if (empty($sample['input'])) {
                    $errors[] = "Input is required for Sample " . ($index + 1);
                }
                if (empty($sample['output'])) {
                    $errors[] = "Output is required for Sample " . ($index + 1);
                }
                if (empty($sample['explanation'])) {
                    $errors[] = "Explanation is required for Sample " . ($index + 1);
                }
            }
        }
    }

    // Validate hidden I/O fields
    if (empty($inputData['hiddenTestCases']) || !array_filter($inputData['hiddenTestCases'], fn($hidden) => $hidden['enabled'])) {
        $errors[] = "At least one enabled hidden input/output is required.";
    } else {
        foreach ($inputData['hiddenTestCases'] as $index => $hidden) {
            if ($hidden['enabled']) {
                if (empty($hidden['input'])) {
                    $errors[] = "Input is required for Hidden Input/Output " . ($index + 1);
                }
                if (empty($hidden['output'])) {
                    $errors[] = "Output is required for Hidden Input/Output " . ($index + 1);
                }
            }
        }
    }

    // Check for duplicate inputs
    function hasDuplicateInputs($data) {
        $enabledInputs = array_filter($data, fn($item) => $item['enabled']);
        $inputs = array_map(function($item) { return $item['input']; }, $enabledInputs);
        return count($inputs) !== count(array_unique($inputs));
    }

    if (hasDuplicateInputs($inputData['samples'])) {
        $errors[] = "Duplicate sample inputs are not allowed.";
    }

    if (hasDuplicateInputs($inputData['hiddenTestCases'])) {
        $errors[] = "Duplicate hidden inputs are not allowed.";
    }

    if (!empty($errors)) {
        sendJsonResponse(false, "Validation failed", $errors);
    } else {
        // Prepare data for insertion/update
        $problemData = [
            'title' => $inputData['title'],
            'description' => $inputData['description'],
            'samples' => array_values(array_filter($inputData['samples'], fn($sample) => $sample['enabled'])),
            'hiddenTestCases' => array_values(array_filter($inputData['hiddenTestCases'], fn($hidden) => $hidden['enabled']))
        ];

        // Insert or update the problem
        if (isset($inputData['id'])) {
            // Update logic
            $result = $collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($inputData['id'])],
                ['$set' => $problemData]
            );

            if ($result->getModifiedCount() > 0) {
                sendJsonResponse(true, "Problem updated successfully");
            } else {
                sendJsonResponse(false, "Failed to update problem or no changes made");
            }
        } else {
            // Insert logic
            $result = $collection->insertOne($problemData);

            if ($result->getInsertedCount() > 0) {
                sendJsonResponse(true, "Problem saved successfully");
            } else {
                sendJsonResponse(false, "Failed to save problem");
            }
        }
    }
} catch (Exception $e) {
    sendJsonResponse(false, "An error occurred: " . $e->getMessage());
}

// Capture any output that occurred before the JSON response
$output = ob_get_clean();

// If there was any output before the JSON, include it in the response
if ($output) {
    $response = json_decode($output, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        // If the output was already valid JSON, just echo it
        echo $output;
    } else {
        // If there was non-JSON output, wrap it in a JSON response
        echo json_encode([
            'success' => false,
            'message' => 'Non-JSON output detected',
            'debug_output' => $output
        ]);
    }
} else {
    // If no prior output, just send the JSON response as is
    echo $output;
}