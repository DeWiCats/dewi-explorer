import axios from "axios";
import { useCallback, useState } from "react";
import { useAsync } from "react-async-hook";

export type epochInfo = {
  epoch: number;
  iot_dc_burned: number;
  iot_delegation_rewards_issued: number;
  iot_rewards_issued_at: string;
  iot_utility_score: number;
  iot_vehnt_at_epoch_start: number;
  iot_vehnt_in_closing_positions: number;
  mobile_dc_burned: number;
  mobile_delegation_rewards_issued: number;
  mobile_rewards_issued_at: string;
  mobile_utility_score: number;
  mobile_vehnt_at_epoch_start: number;
  mobile_vehnt_in_closing_positions: number;
};

export type Stats = {
  avg_hnt: number;
  avg_lockup: number;
  avg_vehnt: number;
  median_hnt: number;
  median_lockup: number;
  median_vehnt: number;
};

export type Total = {
  count: number;
  fall_rate: number;
  hnt: number;
  lockup: number;
  vehnt: number;
};

export type DelegatedStakesInfo = Record<
  string,
  { stats: Stats; total: Total }
> & {
  timestamp: number;
};

export type Position = {
  delegated_position_key: string;
  duration_s: number;
  end_ts: number;
  hnt_amount: number;
  last_claimed_epoch: number;
  lockup_type: string;
  position_key: string;
  purged: boolean;
  start_ts: number;
  sub_dao: string;
  vehnt: number;
};

export type DelegatedStakes = {
  positions: Position[];
  positions_total_len: number;
  timestamp: number;
};

const useHeliumSolana = () => {
  const [epochs, setEpochs] = useState<epochInfo[]>([]);
  const [fetchingDelegateStakes, setFetchingDelegateStakes] = useState(false);
  const [delegatedStakes, setDelegatedStakes] = useState<Position[]>([]);
  const [fetchingDelegateStakesInfo, setFetchingDelegateStakesInfo] =
    useState(false);
  const [delegatedStakesInfo, setDelegatedStakesInfo] =
    useState<DelegatedStakesInfo>();
  const [currentTimestamp, setCurrentTimestamp] = useState<
    string | undefined
  >();

  const fetchEpochs = useCallback(async () => {
    const epochInfo = await axios("/api/epochInfo");
    const { data } = epochInfo;
    return data;
  }, []);

  const fetchDelegatedStakesInfo = useCallback(async () => {
    const delegatedStakesInfo = await axios("/api/delegatedStakesInfo");
    const { data } = delegatedStakesInfo;
    return data;
  }, []);

  const fetchDelegatedStakesCsv = useCallback(async () => {
    const delegatedStakesCsv = await axios("/api/delegatedStakesCsv");
    const { data } = delegatedStakesCsv;
    return data;
  }, []);

  const fetchDelegatedStakes = useCallback(async () => {
    const delegatedStakes = await axios("/api/delegatedStakes");
    const { data } = delegatedStakes;
    console.log("data", data);
    setCurrentTimestamp(data.timestamp);
    return data.delegated_positions;
  }, []);

  const fetchMoreDelegatedStakes = useCallback(async () => {
    const delegatedStakes = await axios(
      `/api/delegatedStakes?timestamp=${currentTimestamp}?start=${500}`
    );
    const { data } = delegatedStakes;
    setCurrentTimestamp(data.timestamp);
    setDelegatedStakes((prev) => [...prev, ...data.positions]);
  }, [currentTimestamp]);

  useAsync(async () => {
    const fetchedEpochs = await fetchEpochs();
    setEpochs(fetchedEpochs);
    setFetchingDelegateStakes(true);
    const fetchedDelegatedStakesInfo = await fetchDelegatedStakesInfo();
    setFetchingDelegateStakesInfo(false);
    setDelegatedStakesInfo(fetchedDelegatedStakesInfo);
    const fetchedDelegatedStakes = await fetchDelegatedStakes();
    setFetchingDelegateStakes(false);
    setDelegatedStakes(fetchedDelegatedStakes);
  }, []);

  return {
    fetchEpochs,
    fetchDelegatedStakesInfo,
    fetchDelegatedStakesCsv,
    fetchDelegatedStakes,
    fetchMoreDelegatedStakes,
    epochs,
    delegatedStakes,
    fetchingDelegateStakes,
    delegatedStakesInfo,
    fetchingDelegateStakesInfo,
  };
};

export default useHeliumSolana;
