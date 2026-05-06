import React from 'react'
import { Type } from '../entities/Type'
import ReactDOM from 'react-dom'


export const PromotionEntities = ({isWhite, onClickPromotionEntity}: {isWhite: boolean, onClickPromotionEntity: (promoteTo: Type) => void}) => {
      
      return ReactDOM.createPortal (
            (<section className='promotionEntities'>
                <img
                  src={`/assets/images/queen-${isWhite ? 'white' : 'black'}.avif`}
                  alt="Queen"
                  onClick={() => onClickPromotionEntity(Type.QUEEN)}
                />

                <img
                  src={`/assets/images/rook-${isWhite ? 'white' : 'black'}.avif`}
                  alt="Rook"
                  onClick={() => onClickPromotionEntity(Type.ROOK)}
                />

                <img
                  src={`/assets/images/bishop-${isWhite ? 'white' : 'black'}.avif`}
                  alt="Bishop"
                  onClick={() => onClickPromotionEntity(Type.BISHOP)}
                />

                <img
                  src={`/assets/images/knight-${isWhite ? "white" : "black"}.avif`}
                  alt="Knight"
                  onClick={() => onClickPromotionEntity(Type.KNIGHT)}
                />
            </section>),
            document.getElementById('portal-root') as HTMLElement
    )
  
}
