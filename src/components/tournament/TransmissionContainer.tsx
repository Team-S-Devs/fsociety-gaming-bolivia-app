import React, { useState } from 'react'
import { Tournament } from '../../interfaces/interfaces'

interface TransmissionContainerProps {
    tournament: Tournament;
}

const TransmissionContainer: React.FC<TransmissionContainerProps> = () => {
  const [selectedLeague, setSelectedLeague] = useState(0);
  const [selectedRound, setSelectedRound] = useState(0);

  return (
    <div>TransmissionContainer</div>
  )
}

export default TransmissionContainer