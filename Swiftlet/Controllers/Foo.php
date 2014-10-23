<?php

namespace Swiftlet\Controllers;

use PDO;

class Foo  extends \Swiftlet\Controller
{
	protected $title = 'Foo'; // Optional but usually desired 

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
				$statement = $db->query('SELECT * FROM shaders where id_category=:id');		
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
echo "<pre style=\"border: 1px solid #000;  overflow: auto; margin: 0.5em;\">";
var_dump($g);
echo "</pre>\n";
		
        // Pass a variable to the view
        $this->view->set('data', $g);
    }
}
