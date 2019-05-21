<?php 

class Entry extends Mapper {
    // Databas anrop
    public function getAllEntries(){
        $statement = $this->db->prepare("SELECT * FROM entries");
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }

    public function getLastXEntries($num) {
        $orderby = 'DESC';
        $statement = $this->db->prepare("SELECT * FROM entries ORDER BY createdAt {$orderby} LIMIT :num");
        $statement->bindParam(':num', $num, PDO::PARAM_INT);
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }

    public function getFirstXEntries($num) {
        $orderby = 'ASC';
        $statement = $this->db->prepare("SELECT * FROM entries ORDER BY createdAt {$orderby} LIMIT :num");
        $statement->bindParam(':num', $num, PDO::PARAM_INT);
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }

    public function getEntriesUserId($userID) {
        $statement = $this->db->prepare("SELECT * FROM entries WHERE createdBy = {$userID}");
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }

    public function getEntriesUserIdLastX($userID, $queryString) {
        $orderby ='DESC';
        $statement = $this->db->prepare("SELECT * FROM entries WHERE createdBy = {$userID} ORDER BY createdAt {$orderby} LIMIT {$queryString['limit']}");
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }

    public function getEntriesUserIdFirstX($userID, $queryString) {
        $orderby ='ASC';
        $statement = $this->db->prepare("SELECT * FROM entries WHERE createdBy = {$userID} ORDER BY createdAt {$orderby} LIMIT {$queryString['limit']}");
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }

    public function postNewEntryUserId($userID, $title, $content){
        $statement = $this->db->prepare("INSERT INTO entries (title, content, createdBy, createdAt) VALUES (:title, :content , :createdBy , :createdAt )");
        date_default_timezone_set("Europe/Stockholm");
        $statement->execute([
          ":title" => $title, 
          ":content" => $content,
          ":createdBy" => $userID,
          ":createdAt" => date('Y-m-d H:i:s')
          ]);
          return "Post send";
    }

    public function deleteEntryById($entryID){
        $statement = $this->db->prepare("DELETE FROM entries WHERE entryID = {$entryID}");
        $statement->execute();
        return "Post deleted";
    }

}
