import ReactDOM from 'react-dom'
import { Type } from './entities/Type'

export const PromotionEntities = ({isWhite, onClickPromotionEntity}: {isWhite: boolean, onClickPromotionEntity: (promoteTo: Type) => void}) => {
      
      const color = !isWhite ? 'white' : 'black';
     
      return ReactDOM.createPortal (
            (<section className='promotionEntities'>
                <img
                  src={require(`..//assets/images/${color}-queen.png`)}
                  alt="Queen"
                  onClick={() => onClickPromotionEntity(Type.QUEEN)}
                />

                <img
                  src={require(`..//assets/images/${color}-rook.png`)}
                  alt="Rook"
                  onClick={() => onClickPromotionEntity(Type.ROOK)}
                />

                <img
                  src={require(`..//assets/images/${color}-bishop.png`)}
                  alt="Bishop"
                  onClick={() => onClickPromotionEntity(Type.BISHOP)}
                />

                <img
                  src={require(`..//assets/images/${color}-knight.png`)}
                  alt="Knight"
                  onClick={() => onClickPromotionEntity(Type.KNIGHT)}
                /> 
            </section>),
            document.getElementById('portal-root') as HTMLElement
    )
  
}
