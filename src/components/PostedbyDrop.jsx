"use client"
import React, { useState } from 'react'
import '../styles/postedbyDrop.scss'

function PostedbyDrop({isPostOpen, addPostedby, removePostedby, handleDropdownClick}) {

    const [selectedItems, setSelectedItems] = useState([]);

    const handleItemClick = (item) => {
        if(selectedItems.includes(item)){
            removePostedby(item);
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else{
            setSelectedItems([...selectedItems, item]);
            addPostedby(item);
        }
    }

  return (

    <div className={`postedby_dropdown ${isPostOpen ? 'open_flex' : ''}`}>

        <div className="information_div">

            <div className="types_div">
                <p>Posted By</p>
                <ul>
                    <li className={selectedItems.includes('Owners')? 'select' : ''} onClick={()=>handleItemClick('Owners')}>Owners</li>
                    <li className={selectedItems.includes('Brokers')? 'select' : ''} onClick={()=>handleItemClick('Brokers')}>Brokers</li>
                    <li className={selectedItems.includes('Builders')? 'select' : ''} onClick={()=>handleItemClick('Builders')}>Builders</li>
                </ul>
                <pre onClick={() => handleDropdownClick('postedby')}>Done</pre>
            </div>
            
        </div>

    </div>
  )
}

export default PostedbyDrop;