<?php

namespace Swiftlet\Controllers;

use PDO;

class Index extends \Swiftlet\Controller
{
	protected $title = 'Home';

	/**
	 * Default action
	 */
	public function index()
	{
		//loop on categories
		try
		{
			$db = new PDO('sqlite:database.db');
			$statement = $db->query('SELECT * FROM categories');
			foreach($statement as $row)
			{
				$g[$row["id_category"]]=array("name"=>$row["name"]);
			}
			 
			// close the database connection
			$db = NULL;
		}
		catch(PDOException $e)
		{
			echo 'Exception : '.$e->getMessage();
		}	
		
		//loop on shaders
		try
		{
			$db = new PDO('sqlite:database.db');
					
			foreach($g as $key=>$value)	
			{
				$statement = $db->query('SELECT * FROM shaders where id_category=:id  ORDER BY name ASC');		
				$statement->execute(array(':id' => (int)$key));
				$rows = $statement->fetchAll();
				$s=array();
				foreach($rows as $row)
					$s[]=array( "name" =>$row["name"], "id"=>$row["id_shader"] );
				$g[$key]["shaders"]=$s;
			}
			// close the database connection
			$db = NULL;
		}
		catch(PDOException $e)
		{
			echo 'Exception : '.$e->getMessage();
		}	
	
	
        // Pass a variable to the view
        $this->view->set('data', $g);

	
		/*
		// Some example code to get you started

		// Create a model instance, see /Swiftlet/Models/Example.php
		$exampleModel = $this->app->getModel('example');

		// Get some data from the model
		$helloWorld = $exampleModel->getHelloWorld();

		// Pass the data to the view to display it
		$this->view->set('helloWorld', $helloWorld);
		*/
	}
}
