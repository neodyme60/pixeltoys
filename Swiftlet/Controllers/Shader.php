<?php

namespace Swiftlet\Controllers;

use PDO;

class Shader  extends \Swiftlet\Controller
{
	protected $title = 'Foo'; // Optional but usually desired 

	public function index()
    {
		echo  "<pre>"+var_dump($this)+"</pre>";
	}
	
	public function get()
    {
		$id=1;		
		
		$tmp=$this->app->getArgs();	
		if (!empty($tmp[0]))
			$id=$tmp[0];
				
		try
		{
			$db = new PDO('sqlite:database.db');
			
			//
			//shader info
			//			
			$statement = $db->query("SELECT * FROM shaders where id_shader = :id");
			$statement->execute(array(':id' => $id));
			$row = $statement->fetch();			
			$s["id"]=$row['id_shader'];
			$s["name"]="effet bidule";
			$s["shader"]=$row["shader"];
			
			//
			//shader textures
			//
			$statement = $db->query("SELECT textures.url FROM textures, shaders INNER JOIN shader_textures ON shaders.id_shader = shader_textures.id_shader AND shader_textures.id_texture = textures.id_texture where shaders.id_shader = :id");
			$statement->execute(array(':id' => $id));
			$rows = $statement->fetchAll();
			foreach($rows as $row)
			{
				$t[]=$row["url"];
			}
			if (!empty($t))
				$s["textures"]=$t;
			
			// close the database connection
			$db = NULL;
		}
		catch(PDOException $e)
		{
			echo 'Exception : '.$e->getMessage();
		}				

		$this->standAlone=true;	
	
        // Pass a variable to the view
        $this->view->set('data', json_encode($s,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_QUOT));
    }
}
