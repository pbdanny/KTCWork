#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May 22 05:20:36 2018
@author: Danny
"""

"""
K-mean clustering from therory
1. Random k centroid
2. Calculate distance each centroid - each datapoint
3. Assign datapoint to closest centroid = k cluster
4. Calculate new centroid from avg distance of each k cluster
5. Back to 2. until change in each cluster so minimal
"""
import random
import os
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt

# read test data
df = pd.read_csv('xclara.csv')
df.shape
df.head(3)

# plot data
df.plot.scatter(x = 'V1', y = 'V2', s = 1)

# Euclidean distance
def dist(df, centroid):
    return (df - centroid).pow(2).sum(axis = 'columns').pow(1/2)

# random centroid
def rand_centroid(df, k):
    dim = df.ndim
    list_cen = []
    for i in range(k):
        for j in range(dim):
            rand_centroid = random.choice(df.iloc[:,j])
            list_cen.append(rand_centroid)
    out = pd.DataFrame(np.array(list_cen).reshape(k,dim),
                      columns = df.columns)
    return out
"""
Cold start centroid, from random point from data
"""
#
centroids = rand_centroid(df, 3)

# calculate distance each centroid
def dist_centroids(df, centroids):
    d = pd.DataFrame()
    for centroid in centroids.values:
        distance = dist(df, centroid)
        d = pd.concat([d, distance], axis = 'columns')
    d.columns = centroids.index
    return d

# choose cluster centroid with least distance
cluster = each_dist.idxmin(axis = 'columns')

# calculate withiness
def withiness(df, centroids, cluster):
    within = 0
    for cen in centroids.index:
        clust_df = df[cluster == cen]
        within = within + dist(clust_df, centroids.iloc[cen]).sum()
    return within


# find new centroid from choose centroid
def new_mean_centroids(df, centroids, cluster):
    new_centroids = pd.DataFrame()
    for cen in centroids.index:
        clust_df = df[cluster == cen]
        new_centroids = new_centroids.append(clust_df.mean(), ignore_index=True)
    return new_centroids
"""
Main start heare

"""
# constant part
K = 3
MAX_LOOP = 50
df = pd.read_csv('xclara.csv')

# intialized centroid
centroids = rand_centroid(df, K)

# max loop for finding centroid
for i in range(MAX_LOOP):

    # calculate distance to centroid
    each_dist = dist_centroids(df, centroids)

    # define cluster to minium distance
    cluster = each_dist.idxmin(axis = 'columns')

    # calculate withiness old
    old_withiness = withiness(df, centroids, cluster)

    # find new centroid
    new_centroids = new_mean_centroids(df, centroids, cluster)

    # calculate new mean centroids
    new_withiness = withiness(df, new_centroids, cluster)

    # quit loop when withinness change so small
    if abs(new_withiness - old_withiness) < 0.0000001:
        print('Slow change withiness, quit at {} loop\n'.format(i))
        break
    else:
        # assign new_centroids to centroids and find better one
        centroids = new_centroids