<?php

class Search extends Mapper
{
    
   

    public function getSerach($search)

    {
        $statement = $this->db->prepare("SELECT * FROM entries WHERE title LIKE '%$search%' OR
        content LIKE '%$search%'");
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }




}