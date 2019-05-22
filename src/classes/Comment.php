<?php 

class Comment extends Mapper {

    public function postNewComment($createdBy, $entryID, $content){
        $statement = $this->db->prepare("INSERT INTO comments (entryID, content, createdBy, createdAt) VALUES (:entryID, :content, :createdBy, :createdAt)");
        date_default_timezone_set("Europe/Stockholm");
        $statement->execute([
          ":entryID" => $entryID,
          ":content" => $content,
          ":createdBy" => $createdBy,
          ":createdAt" => date('Y-m-d H:i:s')
          ]);
          return "Comment send";
    }

}