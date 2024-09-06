<?php
require __DIR__ . '../../../vendor/autoload.php';

function getMongoDBClient() {
    try {
        // Initialize MongoDB client
        $client = new MongoDB\Client("mongodb://localhost:27017");
        return $client;
    } catch (Exception $e) {
        throw new Exception("Failed to initialize MongoDB client: " . $e->getMessage());
    }
}