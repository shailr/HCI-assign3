
# coding: utf-8

# In[162]:


import math
import pandas as pd
import matplotlib.pyplot as plt
from numpy import genfromtxt
from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score

obs = genfromtxt('export.csv', delimiter=',', dtype=(int, float, float, float, float, float, int, bool), skip_header=1)

valid_obs = [x for x in obs if x[7] == True]

valid_obs


# In[163]:


folded_obs = []

for i in range(0, len(valid_obs)):
    r = {}
    if i + 1 < len(valid_obs) and valid_obs[i][0] + valid_obs[i][6]/2 == valid_obs[i + 1][0]:
        r['pair'] = str(valid_obs[i][0]) + '-' + str(valid_obs[i+1][0])
        r['mt'] = valid_obs[i + 1][1] - valid_obs[i][1]
        r['d'] = valid_obs[i][5]
        r['w'] = 2 * valid_obs[i][4]
        r['id'] = math.log((r['d'] / r['w'] + 1), 2)
        r['id_over_mt'] = r['id'] / r['mt']
        r['n'] = valid_obs[i][6]
        folded_obs.append(r)

folded_obs


# In[164]:


df = pd.DataFrame(folded_obs)
avg_mt_by_id = df.groupby(by=['id'], group_keys=True, as_index=True)['mt'].mean().reset_index().values
grp_id, avg_mt = map(list, zip(*avg_mt_by_id))

tp_by_id = df.groupby(by=['id'], group_keys=True, as_index=True)['id_over_mt'].mean().reset_index().values
grp_id_tp, tp = map(list, zip(*avg_mt_by_id))


# In[165]:


obs_x = [[x['id']] for x in folded_obs]
obs_y = [[x['mt']] for x in folded_obs]

regr = linear_model.LinearRegression()
regr.fit(obs_x, obs_y)

b = regr.coef_[0][0]
a = regr.intercept_[0]

print('Regression Coefficients: a = {0}, b = {1}'.format(a, b))


# In[166]:


plt.scatter(obs_x, obs_y, color='black', s=40)
plt.scatter(grp_id, avg_mt, color='green', s=100)
plt.plot(obs_x, [[a + b * x[0]] for x in obs_x], color='blue', linewidth=3)
plt.title('MT over ID with regression line', fontsize=16)
plt.xlabel("Index of Difficulty (ID)", fontsize=12)
plt.ylabel("Movement Time (MT)", fontsize=12)
plt.show()


# In[167]:


plt.scatter(grp_id_tp, tp, color='black', s=40)
plt.title('TP over ID', fontsize=16)
plt.xlabel("Index of Difficulty (ID)", fontsize=12)
plt.ylabel("Throughput (TP)", fontsize=12)
plt.show()

